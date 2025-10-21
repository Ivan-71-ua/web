import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import BalanceAndTransactions from "@/pages/BalanceAndTransactions";
import GoalsAndAchievements from "@/pages/GoalsAndAchievements";
import Assistant from "@/pages/Assistant";
import Auth from "@/pages/Auth";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/balance" element={<BalanceAndTransactions />} />
      <Route path="/goals" element={<GoalsAndAchievements />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}