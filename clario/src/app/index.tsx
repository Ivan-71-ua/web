import { PropsWithChildren } from "react";
import { AppRoutes } from "./routes";

function Providers({ children }: PropsWithChildren) {
  // додаватимеш контексти тут (Redux/Query/Theme і т.д.)
  return children;
}

export default function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}
