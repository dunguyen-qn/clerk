import { Navigation } from "@/components/layouts/navigation";

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div>
      <Navigation />
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
