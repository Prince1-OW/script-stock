import { Helmet } from "react-helmet-async";

const NotFoundSEO = () => (
  <Helmet>
    <title>404 – Page Not Found</title>
    <meta name="robots" content="noindex" />
  </Helmet>
);

export default NotFoundSEO;
