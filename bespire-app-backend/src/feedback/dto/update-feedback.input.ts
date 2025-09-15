import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateFeedbackInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  details?: string;

  @Field(() => ID, { nullable: true })
  category?: string; // ID de FeedbackCategory

  @Field({ nullable: true })
  status?:
    | 'in_progress'
    | 'for_review'
    | 'for_approval'
    | 'revision'
    | 'completed'
    | 'queued'
    | 'needs_info'
    | 'cancelled';

  @Field({ nullable: true })
  priority?: 'low' | 'medium' | 'high' | 'none';
}
