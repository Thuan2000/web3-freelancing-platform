import Header from "@/components/Header";
import PropTypes from 'prop-types';
import { Toaster } from "@/components/ui/toaster";

const Layout= ({ children }) => {
  return (
    <div>
      <Header />
      <main className="p-2 pt-20">{children}</main>
      <Toaster />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Layout;
