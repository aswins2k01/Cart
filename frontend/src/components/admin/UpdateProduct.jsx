import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, updateProduct } from "../../actions/productActions";
import { clearError, clearProductUpdated } from "../../slice/productSlice";
import { toast } from "react-toastify";
import Loader from "../layouts/Loader";

export default function UpdateProduct() {
  const { loading, isProductUpdated, error, product } = useSelector(
    (state) => state.productState,
  );
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  //   let Images = [];

  const [imagesPreview, setImagesPreview] = useState([]);
  const [isImagesCleared, setisImagesCleared] = useState(false);

  const categories = [
    "Mobile Phones",
    "Laptops",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clothes/shoes",
    "Beauty & Health",
    "Sports",
    "Outdoor",
    "Home",
  ];

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState == 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (isProductUpdated) {
      toast.success("Product Updated Successfully", {
        position: "bottom-center",

        onOpen: () => {
          dispatch(clearProductUpdated());
        },
      });
      setImages([]);
      return;
    }
    if (error) {
      toast.error(error, {
        position: "bottom-center",

        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }

    dispatch(getProduct(productId));
  }, [isProductUpdated, error, dispatch, navigate, productId]);

  const ClearimagesHandler = () => {
    setImages([]);

    setImagesPreview([]);
    setisImagesCleared(true);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);

    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("seller", seller);
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("isImagesCleared", isImagesCleared);

    // DEBUG: This loop allows you to see what is REALLY inside the FormData
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    dispatch(updateProduct(productId, formData));
  };

  useEffect(() => {
    if (product._id) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setStock(product.stock);
      setCategory(product.category);
      setSeller(product.seller);
      if (images.length === 0) {
        let oldImages = [];
        product.images.forEach((image) =>
          oldImages.push(image.url || image.image),
        );
        setImages(oldImages);
        setImagesPreview(oldImages);
        setisImagesCleared(false);
      }
    }
  }, [product]);

  return (
    <Fragment>
      {!product._id ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="row">
            <div className="col-12 col-md-2">
              <Sidebar />
            </div>
            <div className="col-12 col-md-10">
              <div className="wrapper my-5">
                <form
                  className="shadow-lg"
                  encType="multipart/form-data"
                  onSubmit={submitHandler}
                >
                  <h1 className="mb-4">Update Product</h1>

                  <div className="form-group">
                    <label htmlFor="name_field">Name</label>
                    <input
                      type="text"
                      id="name_field"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="price_field">Price</label>
                    <input
                      type="text"
                      id="price_field"
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description_field">Description</label>
                    <textarea
                      className="form-control"
                      id="description_field"
                      rows="8"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="category_field">Category</label>
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-control"
                      id="category_field"
                      value={category}
                    >
                      {/* <option value="">select</option> */}
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock_field">Stock</label>
                    <input
                      type="number"
                      id="stock_field"
                      className="form-control"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="seller_field">Seller Name</label>
                    <input
                      type="text"
                      id="seller_field"
                      className="form-control"
                      value={seller}
                      onChange={(e) => setSeller(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Images</label>

                    <div className="custom-file">
                      <input
                        type="file"
                        name="product_images"
                        className="custom-file-input"
                        id="customFile"
                        multiple
                        onChange={imageHandler}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        Choose Images
                      </label>

                      <div>
                        {imagesPreview.length > 0 && (
                          <span
                            className="mr-2"
                            style={{ cursor: "pointer" }}
                            onClick={ClearimagesHandler}
                          >
                            <i className="fa fa-trash"></i>
                          </span>
                        )}
                        {imagesPreview.map((image) => (
                          <img
                            key={image}
                            className="mt-3 mr-2"
                            value={image}
                            src={image}
                            alt="Image preview"
                            height="52"
                            width="55"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    id="login_button"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled={loading}
                  >
                    UPDATE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
