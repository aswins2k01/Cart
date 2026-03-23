import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { clearError, clearUserDeleted } from "../../slice/userSlice";
import { getUsers, deleteUser } from "../../actions/userActions";
import { MDBDataTable } from "mdbreact";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";

export default function UsersList() {
  const {
    users = [],
    error,
    loading,
    isUserDeleted,
  } = useSelector((state) => state.userState);

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
        dispatch(deleteUser(id));
      }
    });
  };

  const setUsers = () => {
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
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
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
    users.forEach((user) =>
      data.rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        actions: (
          <Fragment>
            <Link to={`/admin/users/${user._id}`} className="btn btn-primary">
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={(e) => deleteHandler(e, user._id)}
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
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isUserDeleted) {
      Swal.fire("Deleted!", "The User has been removed.", "success");
      dispatch(clearUserDeleted());
      dispatch(getUsers());
      return;
    }
  }, [dispatch, error, isUserDeleted]);

  return (
    <Fragment>
      {users.length === 0 ? (
        <Loader></Loader>
      ) : (
        <Fragment>
          {" "}
          <div className="row">
            <div className="col-12 col-md-2">
              <Sidebar />
            </div>
            <div className="col-12 col-md-10">
              <h1 className="my-4">Users List</h1>
              <Fragment>
                {" "}
                {loading ? (
                  <Loader />
                ) : (
                  <MDBDataTable
                    data={setUsers()}
                    hover
                    striped
                    bordered
                    className="px-3"
                  ></MDBDataTable>
                )}
              </Fragment>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
