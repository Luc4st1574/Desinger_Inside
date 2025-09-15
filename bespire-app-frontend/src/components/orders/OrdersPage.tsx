"use client";

import OverviewMetricsOrders from "./MetricsOrders";
import OrderList from "./OrdersList";

export default function OrdersPage() {

    return (
        <section className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 flex flex-col gap-6">
            <OverviewMetricsOrders />
            <OrderList />
        </section>
    );
}
