import { useRouter } from "next/router";
import EditProduct from "../components/EditProduct";

const UpdatePage = () => {
  const { query } = useRouter();

  return <EditProduct id={query.id} skip={query.skip} first={query.first} />;
};

export default UpdatePage;
