import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model, Types, PipelineStage } from 'mongoose';
import { CreateReviewInput } from './dto/create-review.input';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RequestsService } from 'src/requests/requests.service';
import { FavoriteMember } from 'src/users/dto/favorite-member.output';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    private readonly requestsService: RequestsService,
  ) {}

  async create(input: CreateReviewInput, reviewerId: string) {
    //antes de crear el review necesito saber a que categoria pertenece y.
    // de ahi buscar los involucrados para darles el review a todos ellos
    const users = [];
    if (input.linkedToType === 'request') {
      const assignees = await this.requestsService.getAssigneesList(
        input.linkedToId,
      );
      if (assignees) {
        users.push(...assignees);
      }
    }
    //crear el review para todos los users
    await Promise.all(
      users.map((userId) =>
        this.reviewModel.create({
          ...input,
          linkedToId: new Types.ObjectId(userId),
          reviewer: new Types.ObjectId(reviewerId),
          linkedToType: 'User',
        }),
      ),
    );
    //ahora si dar el review al linkedtoid tambien
    const doc = await this.reviewModel.create({
      ...input,
      linkedToId: new Types.ObjectId(input.linkedToId),
      reviewer: new Types.ObjectId(reviewerId),
      linkedToType:
        input.linkedToType.charAt(0).toUpperCase() +
        input.linkedToType.slice(1),
    });

    //ahora si enviar a notiicar

    await this.notificationsService.notify({
      users: [],
      type: 'review',
      category: 'request',
      linkedToId: doc.linkedToId,
      meta: {
        reviewer: doc.reviewer.toString(),
        linkedToType: doc.linkedToType,
        rating: doc.rating,
        feedback: doc.feedback,
      },
    });
    return {
      _id: doc._id.toString(),
      linkedToId: doc.linkedToId.toString(),
      linkedToType: doc.linkedToType,
      rating: doc.rating,
      feedback: doc.feedback,
      createdAt: doc.createdAt,
    };
  }

  async findByRequest(requestId: string) {
    console.log('Finding reviews for request:', requestId);
    const requestObjectId = new Types.ObjectId(requestId);
    const docs = await this.reviewModel
      .find({ linkedToType: 'request', linkedToId: requestObjectId })
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found reviews:', docs.length);
    return docs.map((d) => ({
      _id: d._id.toString(),
      linkedToId: d.linkedToId.toString(),
      linkedToType: d.linkedToType,
      rating: d.rating,
      feedback: d.feedback,
      createdAt: d.createdAt,
    }));
  }

  async getAverageRatingByReviewer(reviewerId: string): Promise<number> {
    const reviews = await this.reviewModel
      .find({ reviewer: new Types.ObjectId(reviewerId) })
      .lean();
    console.log(
      `Calculating average rating for reviewer ${reviewerId}:`,
      reviews.length,
    );
    if (reviews.length === 0) return 0;

    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  }

  async findTopUserReviewsByClient(
    clientId: string,
    limit = 3,
  ): Promise<FavoriteMember[]> {
    const pipeline: PipelineStage[] = [
      // --- Fase 1: Encontrar las reseñas relevantes ---
      {
        $match: {
          reviewer: new Types.ObjectId(clientId),
          linkedToType: 'User', // Nota: Asegúrate que el string coincida con tu schema
        },
      },
      // --- Fase 2: Agrupar para obtener usuarios únicos ---
      {
        $group: {
          _id: '$linkedToId', // Agrupa por el ID del usuario reseñado
          lastReviewedAt: { $max: '$createdAt' }, // Guarda la fecha de la última reseña
        },
      },
      // --- Fase 3: Ordenar por la reseña más reciente ---
      {
        $sort: {
          lastReviewedAt: -1,
        },
      },
      // --- Fase 4: Limitar al top 3 (o el límite especificado) ---
      {
        $limit: limit,
      },
      // --- Fase 5: Buscar TODAS las reseñas de esos usuarios para calcular el promedio GENERAL ---
      {
        $lookup: {
          from: 'reviews', // La colección de reseñas
          localField: '_id', // El ID del usuario de la fase anterior
          foreignField: 'linkedToId', // Coincide con todas sus reseñas
          as: 'allUserReviews', // Guarda todas las reseñas en un array temporal
        },
      },
      // --- Fase 6: Calcular el promedio y poblar los datos del usuario ---
      {
        $lookup: {
          from: 'users', // La colección de usuarios
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      // --- Fase 7: Limpiar y dar forma a la salida final ---
      {
        $unwind: '$userDetails', // Descomprime el array de userDetails
      },
      {
        $project: {
          _id: 0, // Opcional: para quitar el _id duplicado
          id: '$userDetails._id',
          name: {
            $concat: [
              '$userDetails.firstName', // Primer string
              ' ', // Un espacio como separador
              '$userDetails.lastName', // Segundo string
            ],
          },
          avatar: '$userDetails.avatarUrl',
          workspaceId: '$userDetails.workspaceSelected',
          rating: { $avg: '$allUserReviews.rating' },
        },
      },
    ];

    const favoriteMembers = await this.reviewModel.aggregate(pipeline);
    return favoriteMembers;
  }
}
