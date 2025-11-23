import { ParentComponent } from "solid-js";
import Navigation from "./Navigation";
import { ThemeProvider } from "./ThemeProvider";

export const Layout: ParentComponent = (props) => {
  return (
    <ThemeProvider>
      <div class="min-h-screen bg-surface text-text-primary">
        <Navigation />
        <main>{props.children}</main>
      </div>
    </ThemeProvider>
  );
};
