// components/SalesOverviewSidebar.tsx
import Image from 'next/image';
import { Calendar, BarChart3, Wallet, ClipboardCheck } from 'lucide-react';
import salesData from "@/data/salesData.json";

type Prospect = (typeof salesData.prospects.list)[0];

type SalesOverviewSidebarProps = {
  prospect: Prospect;
};

// A reusable component for each section to keep the code clean
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
        <h3 className="text-sm text-[#5E6B66]">{title}</h3>
        <div>{children}</div>
    </div>
);

export default function SalesOverviewSidebar({ prospect }: SalesOverviewSidebarProps) {
    const expectedRevenue = prospect.value * prospect.term;

    const contactedDate = new Date(prospect.since).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    // --- FIX: Updated the color styles for the priority badge ---
    const priority = prospect.priority.toLowerCase();
    const priorityStyles = {
        high: {
            container: "bg-[#ff6a6a] text-white",
            bar: "bg-[#c70000]",
        },
        medium: {
            container: "bg-[#fedaa0] text-black",
            bar: "bg-[#ca820e]",
        },
        low: {
            container: "bg-[#defcbd] text-black",
            bar: "bg-[#b8df91]",
        },
    };
    const styles = priorityStyles[priority as keyof typeof priorityStyles] || priorityStyles.low;

    return (
        <aside className="w-70 min-w-[280px] p-6 border-r border-[#E2E6E4] flex flex-col gap-5 overflow-y-auto">
            <h1 className="font-medium text-xl text-[#181B1A] pb-2">Overview</h1>

            <Section title="Priority">
                <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium ${styles.container}`}
                >
                    <span className={`h-4 w-1 rounded-full ${styles.bar}`} />
                    <span className="capitalize">{priority}</span>
                </div>
            </Section>

            <Section title="Prospect Client">
                <div className="flex items-center gap-3">
                    <Image
                        src={prospect.logo}
                        alt={`${prospect.title} logo`}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{prospect.title}</span>
                </div>
            </Section>

            <Section title="Client Contact">
                <div className="flex items-center gap-3">
                    <Image
                        src={prospect.contactAvatar}
                        alt={prospect.contact}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <div className="font-medium">{prospect.contact}</div>
                        <div className="text-sm text-[#5E6B66]">{prospect.title}</div>
                    </div>
                </div>
            </Section>

            <Section title="Sales Team">
                <ul className="flex flex-col gap-3">
                    {prospect.assigned.map(member => (
                        <li key={member.name} className="flex items-center gap-3">
                            <Image
                                src={member.avatar}
                                alt={member.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-medium text-sm">{member.name}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title="Date Contacted">
                <div className="flex items-center gap-2 font-medium">
                    <ClipboardCheck size={18} className="text-[#5E6B66]" />
                    <span>{contactedDate}</span>
                </div>
            </Section>

            <Section title="Target Plan">
                <div className="flex items-center gap-2 font-medium">
                    <BarChart3 size={18} className="text-[#5E6B66]" />
                    <span>{prospect.targetPlan}</span>
                </div>
            </Section>

            <Section title="Expected Revenue">
                <div className="flex items-center gap-2 font-medium">
                    <Wallet size={18} className="text-[#5E6B66]" />
                    <span>
                        {`$${expectedRevenue.toLocaleString('en-US')}`}
                    </span>
                </div>
            </Section>

            <Section title="Term">
                <div className="flex items-center gap-2 font-medium">
                    <Calendar size={18} className="text-[#5E6B66]" />
                    <span>{prospect.term} months</span>
                </div>
            </Section>

            <Section title="Industry">
                <span
                    className="px-3 py-1 rounded-full text-black text-sm font-medium w-fit"
                    style={{ backgroundColor: prospect.bgColor }}
                >
                    {prospect.industry}
                </span>
            </Section>
        </aside>
    );
}