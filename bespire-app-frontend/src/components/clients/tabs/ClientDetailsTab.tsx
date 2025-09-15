import React, { useState, useEffect } from "react";
import CommonRequestBadge from "@/components/ui/CommonRequestBadge";
import Dropdown from "@/components/ui/Dropdown";
import MemberCard from "@/components/ui/MemberCard";
import useClientStats from "../../../hooks/clients/useClientStats";
import useClientFavoriteMembers from "../../../hooks/clients/useClientFavoriteMembers";
import useTopServices from "@/hooks/requests/useTopServices";
import type { ClientDetail } from "../../../hooks/clients/useClientDetail";
import CommonPhrasesBadge from "@/components/ui/CommonPhrasesBadge";
type FavoriteMember = {
  name: string;
  role?: string;
  rating?: string | number;
  services?: string[];
  avatar?: string;
};

interface ClientDetailsTabProps {
  client: ClientDetail; // Tipado más específico desde el hook
}

const ClientDetailsTab: React.FC<ClientDetailsTabProps> = ({ client }) => {
  const [period, setPeriod] = useState<string>("weekly");

  // Local widened client type for optional backend-provided fields
  type LocalTypedClient = ClientDetail & {
    commonRequests?: string[];
    currentStats?: {
      newTasks?: number;
      pending?: number;
      completed?: number;
      credits?: number | string;
    };
    stats?: {
      hoursLogged?: number;
      credits?: number;
      timePerRequest?: string | number;
      responseTime?: string | number;
      taskVolume?: number;
      revisionsPerTask?: number;
      rating?: number;
      lastSession?: string;
    };
    phrases?: string[];
  };

  const typedClient = client as unknown as LocalTypedClient;

  // Hooks para stats y favorite members — cargan por separado
  const {
    stats,
    loading: loadingStats,
    refetch: refetchStats,
  } = useClientStats(typedClient?.id, period, { enabled: !!typedClient?.id });
  const {
    members,
    loading: loadingMembers,
    error: errorMembers,
    refetch: refetchMembers,
  } = useClientFavoriteMembers(typedClient?.id, { enabled: !!typedClient?.id });

  useEffect(() => {
    if (typedClient?.id) {
      refetchStats?.();
      refetchMembers?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedClient?.id, period]);

  // top services for workspace (fallback to client.commonRequests)
  const { services: topServices } = useTopServices(client?.workspaceId);

  return (
    <div className="flex flex-col gap-6 ">
      <div className="space-y-4">
        <h3 className="font-medium text-base text-gray-700">Company Mission</h3>
        <p className="text-base text-gray-600">
          {typedClient?.companyData?.mission}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Most Common Requests</h3>
        <div className="flex flex-wrap gap-2">
          {(topServices && topServices.length > 0
            ? topServices.map((s) => s.Type)
            : typedClient.commonRequests ?? []
          ).map((request: string, index: number) => (
            <CommonRequestBadge
              withIcon
              key={index}
              requestName={request}
              variant="outlined"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">
          Current with {typedClient.name}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <div className="bg-green-bg-400 p-2 md:p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg md:text-2xl font-bold">
                {typedClient.currentStats?.newTasks ?? 0}
              </h4>
            </div>
            <div className="text-xs md:text-sm">New Tasks</div>
          </div>

          <div className="bg-orange-200 p-2 md:p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg md:text-2xl font-bold">
                {typedClient.currentStats?.pending ?? 0}
              </h4>
            </div>
            <div className="text-xs md:text-sm ">Pending Review</div>
          </div>

          <div className="bg-pale-green-500 p-2 md:p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg md:text-2xl font-bold">
                {typedClient.currentStats?.completed ?? 0}
              </h4>
            </div>
            <div className="text-xs md:text-sm ">Completed (Week)</div>
          </div>

          <div className="bg-red-red-100 p-2 md:p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg md:text-2xl font-bold">
                {typedClient.currentStats?.credits ?? "—"}
              </h4>
            </div>
            <div className="text-xs md:text-sm ">Running Credits</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700">Key Work Statistics</h3>
          <Dropdown
            items={[
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
            ]}
            selectedValue={period}
            onSelect={(item) => setPeriod(item.value)}
            variant="outlineG"
            size="sm"
            className="border border-gray-200"
            showChevron={true}
          />
        </div>

        {/* Contenedor principal con borde */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white p-2">
          <div className="grid grid-cols-2">
            {/* Columna izquierda */}
            <div className="space-y-2 p-4">
              <div className="flex justify-between pb-3">
                <span className="text-base ">Hours Logged</span>
                <span className="text-sm text-green-gray-800 font-medium">
                  {loadingStats
                    ? "—"
                    : stats?.hoursLogged ?? typedClient.stats?.hoursLogged}
                </span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-base ">Credit Consumption</span>
                <span className="text-sm text-green-gray-800 font-medium">
                  {loadingStats
                    ? "—"
                    : stats?.credits ?? typedClient.stats?.credits}
                </span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-base ">Time per Request</span>
                <span className="text-sm text-green-gray-800 font-medium">
                  {loadingStats
                    ? "—"
                    : stats?.timePerRequest ??
                      typedClient.stats?.timePerRequest}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base ">Avg. Response Time</span>
                <span className="text-sm text-green-gray-800 font-medium">
                  {loadingStats
                    ? "—"
                    : stats?.responseTime ?? typedClient.stats?.responseTime}
                </span>
              </div>
            </div>

            {/* Divisor vertical */}
            <div className="border-l border-gray-200">
              {/* Columna derecha */}
              <div className="space-y-2 p-4">
                <div className="flex justify-between pb-3">
                  <span className="text-base ">Task Volume</span>
                  <span className="text-sm text-green-gray-800 font-medium">
                    {loadingStats
                      ? "—"
                      : stats?.taskVolume ?? typedClient.stats?.taskVolume}
                  </span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-base ">Revisions per Task</span>
                  <span className="text-sm text-green-gray-800 font-medium">
                    {loadingStats
                      ? "—"
                      : stats?.revisionsPerTask ??
                        typedClient.stats?.revisionsPerTask}
                  </span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-base">Avg. Client Rating</span>
                  <span className="text-sm text-green-gray-800 font-medium">
                    {loadingStats
                      ? "—"
                      : stats?.rating ?? typedClient.stats?.rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base ">Last Session</span>
                  <span className="text-sm text-green-gray-800 font-medium">
                    {loadingStats
                      ? "—"
                      : stats?.lastSession ?? typedClient.stats?.lastSession}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">
          Common Phrases in Requests
        </h3>
        <div className="flex flex-wrap gap-2">
          {((typedClient.phrases ?? []) as string[]).map(
            (phrase: string, index: number) => (
              <CommonPhrasesBadge
                phrase={phrase}
                variant="colored"
                key={index}
              />
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Favorite Bespire Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          {loadingMembers ? (
            <div className="col-span-3 p-4">Cargando miembros...</div>
          ) : errorMembers ? (
            <div className="col-span-3 p-4">Error cargando miembros</div>
          ) : (
            (members ?? []).map((m: FavoriteMember, index: number) => {
              const mapped = {
                name: m.name,
                role: m.role ?? "",
                rating:
                  typeof m.rating === "number"
                    ? m.rating
                    : Number(m.rating) || 0,
                services: m.services ?? [],
                avatarUrl: m.avatar ?? null,
              };

              return <MemberCard key={index} member={mapped} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsTab;
