import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LandingPageWithMap } from "./pages/LandingPageWithMap";
import { RequestPage } from "./pages/RequestPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ReportPage } from "./pages/ReportPage";
import { LocalLoginPage } from "./pages/LocalLoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { LocalTasksPage } from "./pages/LocalTasksPage";
import { LocalUploadPage } from "./pages/LocalUploadPage";
import { PhotoUploadDemo } from "./pages/PhotoUploadDemo";
import { AddReviewPage } from "./pages/AddReviewPage";
import { AccountPage } from "./pages/AccountPage";
import { ComponentsDemo } from "./pages/ComponentsDemo";
import { LocationUploadDemo } from "./pages/LocationUploadDemo";
import { CameraDiagnostics } from "./pages/CameraDiagnostics";
import { CameraDiagnosticsPage } from "./pages/CameraDiagnosticsPage";
import { SimpleCameraTest } from "./pages/SimpleCameraTest";
import { CameraTestSimple } from "./pages/CameraTestSimple";
import { TestCameraGPS } from "./pages/TestCameraGPS";
import NearbyPlaces from "./pages/NearbyPlaces";
import { LoginPage } from "./pages/LoginPage";
import { RewardsDashboard } from "./pages/RewardsDashboard";
import RewardsLevelsDashboard from "./pages/RewardsLevelsDashboard";
import { TrustSafetyPage } from "./pages/TrustSafetyPage";
import AdminPanel from "./pages/AdminPanel";
import { VerifierDashboard } from "./pages/VerifierDashboard";
import { VerifierTaskPage } from "./pages/VerifierTaskPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AIModerationPanel } from "./pages/AIModerationPanel";
import { AdminUserManagement } from "./pages/AdminUserManagement";
import { AdminRewards } from "./pages/AdminRewards";
import { AdminContributors } from "./pages/AdminContributors";
import { AdminReviews } from "./pages/AdminReviews";
import { SupabaseSetupPage } from "./pages/SupabaseSetupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/home",
    Component: LandingPageWithMap,
  },
  {
    path: "/original",
    Component: LandingPage,
  },
  {
    path: "/request",
    Component: RequestPage,
  },
  {
    path: "/nearby",
    Component: NearbyPlaces,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/rewards",
    Component: RewardsDashboard,
  },
  {
    path: "/rewards-levels",
    Component: RewardsLevelsDashboard,
  },
  {
    path: "/trust-safety",
    Component: TrustSafetyPage,
  },
  {
    path: "/admin-old",
    Component: AdminPanel,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/reviews",
    Component: AdminReviews,
  },
  {
    path: "/admin/users",
    Component: AdminUserManagement,
  },
  {
    path: "/admin/ai-moderation",
    Component: AIModerationPanel,
  },
  {
    path: "/admin/rewards",
    Component: AdminRewards,
  },
  {
    path: "/admin/transactions",
    Component: AdminRewards,
  },
  {
    path: "/admin/analytics",
    Component: AdminDashboard,
  },
  {
    path: "/admin/settings",
    Component: AdminDashboard,
  },
  {
    path: "/admin/contributors",
    Component: AdminContributors,
  },
  {
    path: "/report/:id",
    Component: ReportPage,
  },
  {
    path: "/add-review",
    Component: AddReviewPage,
  },
  {
    path: "/local/login",
    Component: LocalLoginPage,
  },
  {
    path: "/local/signup",
    Component: SignUpPage,
  },
  {
    path: "/local/tasks",
    Component: LocalTasksPage,
  },
  {
    path: "/local/upload/:taskId",
    Component: LocalUploadPage,
  },
  {
    path: "/demo/photo-upload",
    Component: PhotoUploadDemo,
  },
  {
    path: "/demo/components",
    Component: ComponentsDemo,
  },
  {
    path: "/demo/location-upload",
    Component: LocationUploadDemo,
  },
  {
    path: "/diagnostics",
    Component: CameraDiagnostics,
  },
  {
    path: "/diagnostics-full",
    Component: CameraDiagnosticsPage,
  },
  {
    path: "/camera-test",
    Component: SimpleCameraTest,
  },
  {
    path: "/test-camera",
    Component: CameraTestSimple,
  },
  {
    path: "/test-camera-gps",
    Component: TestCameraGPS,
  },
  {
    path: "/account",
    Component: AccountPage,
  },
  {
    path: "/supabase-setup",
    Component: SupabaseSetupPage,
  },
  {
    path: "/verifier/dashboard",
    Component: VerifierDashboard,
  },
  {
    path: "/verifier/task/:taskId",
    Component: VerifierTaskPage,
  },
]);