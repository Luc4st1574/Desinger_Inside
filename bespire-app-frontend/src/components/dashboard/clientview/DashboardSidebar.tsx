/* eslint-disable @next/next/no-img-element */
import Button from "../../ui/Button";
import { ChevronRight, Zap } from "lucide-react";
import requestData from "@/data/requestData.json";

export default function DashboardSidebar() {
  const { clientInfo, requests, serviceProvider, ClientTeam } = requestData;

  const requestsCreated = requests.list.length;
  const hoursSpent = 33;

  const percentageUsed = (clientInfo.usedCredits / clientInfo.totalCredits) * 100;
  const creditsLeft = clientInfo.totalCredits - clientInfo.usedCredits;

  return (
    <aside className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
      <div className="p-4 space-y-6 overflow-y-auto flex-grow">
        {/* Account Info */}
        <div className="flex items-center gap-4">
          <img
            src={clientInfo.logo}
            alt={clientInfo.name}
            className="w-12 h-12"
          />
          <div>
            <div className="font-semibold text-xl">{clientInfo.name}</div>
            <div className="text-xs text-gray-500 uppercase">{clientInfo.accountType}</div>
          </div>
        </div>

        {/* Credits Info */}
        <div className="border-b border-[#dcdddc] pb-4">
          <div className="text-sm text-gray-500">Credits this month</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-2xl font-bold">{creditsLeft}</span>
            <span className="text-md text-gray-400">/ {clientInfo.totalCredits} left</span>
            <Button
              type="button"
              variant="transparent"
              className="border border-[#697d67] ml-4 text-[#697d67] pl-2.5 pr-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
              onClick={() => console.log("Upgrade clicked")}
            >
              <span className="flex items-center gap-1">
                Upgrade
                <Zap className="w-3 h-3" />
              </span>
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div
              className="h-2.5 rounded-full"
              style={{ width: `${percentageUsed}%`, backgroundColor: '#697d67' }}
            ></div>
          </div>

          <div className="flex justify-between items-center w-full mt-4">
            <div className="flex flex-col text-xs text-gray-500">
              <span>Hours Spent</span>
              <span className="text-base text-black">{hoursSpent}</span>
            </div>
            <div className="flex flex-col text-xs text-gray-500">
              <span>Requests Created</span>
              <span className="text-base text-black">{requestsCreated}</span>
            </div>
          </div>
        </div>

        {/* Spherule Team List */}
        <div>
          <div className="text-sm font-medium mb-2">{ClientTeam.name} →</div>
          <ul className="space-y-2">
            {ClientTeam.members.map((user, index) => (
              <li key={index} className="flex items-center gap-3">
                <img src={user.avatar} className="w-8 h-8 rounded-full" alt={user.name} />
                <div className="flex-1">
                  <div className="text-sm">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.title}</div>
                </div>
                <button
                  className="p-1 hover:bg-gray-100 rounded-full"
                  title="Send message"
                  aria-label={`Send message to ${user.name}`}
                >
                  <img
                    src="/assets/icons/message-text-square.svg"
                    className="w-5"
                    alt="Send message icon"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Team on Bespire List */}
        <div>
          <div className="text-sm font-medium mb-2">Team on {serviceProvider.name} →</div>
          <ul className="space-y-2">
            {serviceProvider.team.map((user, index) => (
              <li key={index} className="flex items-center gap-3">
                <img src={user.avatar} className="w-8 h-8 rounded-full" alt={user.name} />
                <div className="flex-1">
                  <div className="text-sm">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.title}</div>
                </div>
                <button
                  className="p-1 hover:bg-gray-100 rounded-full"
                  title="Send message"
                  aria-label={`Send message to ${user.name}`}
                >
                  <img
                    src="/assets/icons/message-text-square.svg"
                    className="w-5"
                    alt="Send message icon"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="w-full bg-[#ebfdd8] text-black font-semibold underline py-3 flex items-center justify-center gap-2 hover:brightness-95 transition-all">
        Go to Account <ChevronRight className="w-5 h-5" />
      </button>
    </aside>
  );
}