import { useRouter } from "next/router";
import SingleProduct from "../../components/SingleProduct";
const SingleProductPage = () => {
  const router = useRouter();

  return <SingleProduct id={router.query.id} />;
};

export default SingleProductPage;
