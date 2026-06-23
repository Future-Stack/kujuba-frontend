import { baseApi } from "../api/baseApi";


export interface Stats {
  total_revenue: number;
  revenue_growth: number;

  total_users: number;
  user_growth: number;

  total_inspectors: number;
  inspector_growth: number;

  pending_approvals: number;
  pending_approval_growth: number;

  active_inspections: number;
  active_growth: number;

  completed_inspections: number;
  completed_growth: number;

  cancelled_inspections: number;
  cancelled_growth: number;

  pending_inspections: number;
  pending_growth: number;
}



export interface RecentUser {
  id: number;
  name: string;
  email: string;
  status: string;
  profile: {
    phone: string | null;
    address: string | null;
    avatar: string | null;
  };
}



export interface TopInspector {
  id: number;
  name: string;
  profile: {
    phone: string | null;
    address: string | null;
    avatar: string | null;
  };
  total_earnings: number;
}



export interface InspectionType {
  title: string;
  image: string;
}

export interface RequestApproval {
  id: number;
  name: string;
  short_name: string;
  email: string;
  profile: {
    phone: string | null;
    address: string | null;
    avatar: string | null;
  };
  inspection_types: InspectionType[];
}



export interface TopInspectionType {
  id: number;
  title: string;
  image: string;
  total_bookings: number;
}



export interface RecentInspection {
  id: number;
  inspection_type: string;
  image: string;
  inspector: string;
  status: string;
  duration: string | null;
}



export interface BarChart {
  date: string;
  assigned: string;
  started: string;
  completed: string;
}

export interface CircleChart {
  total_task: number;
  assigned_inspection: number;
  started_inspection: number;
  completed_inspection: number;
}



export interface RecentActivity {
  title: string;
  description: string;
  time: string | null;
}

export interface FinanceMetrics {
receive_payment: string;
payout: string;
}

export interface FinanceChart {
label: string;
receive: number
payout: number;
}


export interface DashboardOverview {
  stats: Stats;

  recent_users: RecentUser[];

  top_inspectors: TopInspector[];

  request_approvals: RequestApproval[];

  top_inspection_types: TopInspectionType[];

  recent_inspections: RecentInspection[];

  bar_chart: BarChart[];

  circle_chart: CircleChart;

  recent_activity: RecentActivity[];

  finance_metrics: FinanceMetrics;

  finance_chart: FinanceChart[];
}

type OverviewQuery = {
  from_date?: string;
  to_date?: string;
};


export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<
      { success: boolean; data: DashboardOverview },
   { from_date?: string; to_date?: string; range?: string } | void
      
    >({
      query: (params) => ({
        url: "/admin/dashboard/overview",
        params: params ?? {},
      }),
       keepUnusedDataFor: 0, 
    }),
  }),
});



export const {
  useGetOverviewQuery,
} = overviewApi;