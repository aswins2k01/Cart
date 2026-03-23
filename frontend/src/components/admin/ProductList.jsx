import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { clearError } from "../../slice/productsSlice";
import { deleteProduct, getAdminProducts } from "../../actions/productActions";
import { MDBDataTable } from "mdbreact";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import { clearProductDeleted } from "../../slice/productSlice";
export default function ProductList() {
  const {
    products = [],
    error,
    loading,
  } = useSelector((state) => state.productsState);
  const {
    error: productError,

    isProductDeleted,
  } = useSelector((state) => state.productState);
  const dispatch = useDispatch();

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes , delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(id));
      }
    });
  };

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };
    products.forEach((product) =>
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        actions: (
          <Fragment>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={(e) => deleteHandler(e, product._id)}
              className="btn btn-danger py-1 px-2 ml-2"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </Fragment>
        ),
      }),
    );
    return data;
  };

  useEffect(() => {
    if (error || productError) {
      toast.error(error || productError, {
        position: "bottom-center",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isProductDeleted) {
      Swal.fire("Deleted!", "The product has been removed.", "success");
      dispatch(clearProductDeleted());
      return;
    }
    dispatch(getAdminProducts());
  }, [dispatch, error, productError, isProductDeleted]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Product List</h1>
        <Fragment>
          {" "}
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setProducts()}
              hover
              striped
              bordered
              className="px-3"
            ></MDBDataTable>
          )}
        </Fragment>
      </div>
    </div>
  );
}
