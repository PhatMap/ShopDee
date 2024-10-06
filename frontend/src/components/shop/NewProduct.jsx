import React, { Fragment, useState, useEffect, useCallback } from "react";

import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  newProduct,
  clearErrors,
  uploadImages,
} from "../../actions/productActions";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { Link, useNavigate } from "react-router-dom";
import Back from "../layout/Back";
import Variant from "./Variant";
import AddVariant from "./AddVariant";
import { getCategoryAll } from "../../actions/categoryActions";
const NewProduct = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [variants, setVariants] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [emptyPrice, setEmptyPrice] = useState(false);
  const [emptyName, setEmptyName] = useState(false);
  const [emptyDescription, setEmptyDescription] = useState(false);
  const [emptyCategory, setEmptyCategory] = useState(false);
  const [emptyImages, setEmptyImages] = useState(false);
  const [emptyVariants, setEmptyVariants] = useState(false);
  const [variantError, setVariantError] = useState(false);
  const [load, setLoad] = useState(false);

  const { loading, error, success } = useSelector((state) => state.newProduct);
  const {
    loading: categoryLoading,
    error: categoryError,
    categories,
  } = useSelector((state) => state.category);

  useEffect(() => {
    if (categoryError) {
      toast.error(categoryError);
      dispatch(clearErrors());
    }
  }, [dispatch, categoryError]);
  useEffect(() => {
    if (categoryError) {
      toast.error(categoryError);
      dispatch(clearErrors());
    }
  }, [dispatch, categoryError]);

  useEffect(() => {
    dispatch(getCategoryAll());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      history("/shopkeeper/products");
      toast.success("Product created successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, success, history]);

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoad(true);

    if (
      name === "" ||
      price === 0 ||
      description === "" ||
      category === "" ||
      images.length === 0 ||
      variants.length === 0
    ) {
      if (name === "") {
        setEmptyName(true);
      }
      if (price === "") {
        setEmptyPrice(true);
      }
      if (description === "") {
        setEmptyDescription(true);
      }
      if (category === "") {
        setEmptyCategory(true);
      }
      if (images.length === 0) {
        setEmptyImages(true);
      }
      if (variants.length === 0) {
        setEmptyVariants(true);
      }
      return toast.error("Chưa điền đủ thông tin sản phẩm");
    }

    if (variantError) {
      return toast.error("Sản phẩm có mẫu chưa đủ thông tin");
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("description", description);
    formData.set("category", category);

    let variantsImages = [];

    await Promise.all(
      variants.map(async (variant, index) => {
        await Promise.all(
          variant.images.map(async (image) => {
            const upload = new FormData();
            upload.append("images", image);
            try {
              const result = await dispatch(uploadImages(upload));
              variantsImages.push({
                id: index,
                image: result,
              });
            } catch (error) {
              console.error("Error uploading image:", error);
            }
          })
        );
      })
    );

    const variantsResult = await Promise.all(variantsImages);

    const updatedVariants = [...variants];

    updatedVariants.forEach((variant, index) => {
      let variantImages = [];

      variantsResult.forEach((result) => {
        if (result.id === index) {
          variantImages.push({
            public_id: result.image.image.public_id,
            url: result.image.image.url,
          });
        }
      });

      const updatedVariant = {
        ...updatedVariants[index],
        images: variantImages,
      };

      updatedVariants[index] = updatedVariant;
    });

    let totalStock = 0;
    updatedVariants.forEach((variant) => {
      variant.inventory.forEach((inventory) => {
        totalStock += inventory.stock;
      });
    });

    formData.set("totalStock", totalStock);
    formData.set("variants", JSON.stringify(updatedVariants));

    let cloudinaryImages = [];

    images.forEach((image) => {
      const upload = new FormData();
      upload.append("images", image);
      cloudinaryImages.push(dispatch(uploadImages(upload)));
    });

    const cloudinaryResult = await Promise.all(cloudinaryImages);

    let imagesLinks = [];
    cloudinaryResult.forEach((result) => {
      imagesLinks.push(result.image);
    });

    formData.set("images", JSON.stringify(imagesLinks));

    dispatch(newProduct(formData));
  };

  const onChange = (e) => {
    if (imagesPreview.length >= 5) {
      return toast.error("Chỉ được tối đa 5 hình");
    }
    
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const updateVariant = useCallback(
    (updatedVariant, index) => {
      setVariants((prevVariants) => {
        const currentVariants = [...prevVariants];
        currentVariants[index] = updatedVariant;
        return currentVariants;
      });
    },
    [setVariants]
  );

  const removeVariant = useCallback(
    (index) => {
      setVariants((prevVariants) => {
        const updatedVariants = [...prevVariants];
        updatedVariants.splice(index, 1);
        return updatedVariants;
      });
    },
    [setVariants]
  );

  const handlePriceChange = (e) => {
    const inputValue = e.target.value;
    setEmptyPrice(false);

    if (!isNaN(inputValue) && inputValue !== "") {
      const numericValue = parseFloat(inputValue);
      if (numericValue >= 0) {
        setPrice(numericValue);
      } else {
        setPrice(-numericValue);
      }
    } else {
      setPrice("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("hover");
    const files = e.dataTransfer.files;
    onChange({ target: { files } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("hover");
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("hover");
  };

  const handlerImageRemove = (index) => {
    const newImages = imagesPreview.filter((img, i) => i !== index);
    const newImagesFiles = images.filter((img, i) => i !== index);
    setImagesPreview(newImages);
    setImages(newImagesFiles);
  };

  const handlerSwap = (index) => {
    if (selectedImage === null) {
      setSelectedImage(index);
    } else {
      if (index === selectedImage || imagesPreview.length === 1) {
        setSelectedImage(null);
      } else {
        const copy = [...imagesPreview];
        const temp = copy[index];
        copy[index] = copy[selectedImage];
        copy[selectedImage] = temp;
        setImagesPreview(copy);
        setSelectedImage(null);
      }
    }
  };

  return (
    <Fragment>
      <MetaData title={"New Product"} />
      <div className="admin-layout">
        <div className="admin-container">
          <div className="flex-center-screen">
            <Link
              type="button"
              className="back-btn-1"
              onClick={() => history(-1)}
            >
              Quay lại
            </Link>
            <div className="manage-head">
              <h1>Thêm Sản Phẩm</h1>
            </div>
            <div className="group-1">
              <div className="new-product-form-group ">
                <label htmlFor="category_field">Danh mục</label>
                <select
                  className={`form-control ${emptyCategory ? "invalid" : ""}`}
                  id="category_field"
                  value={category}
                  onChange={(e) => {
                    setEmptyCategory(false);
                    if (e.target.value !== "") {
                      setCategory(e.target.value);
                    }
                  }}
                >
                  <option value="">Chọn một danh mục</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.vietnameseName}
                      </option>
                    ))}
                </select>
                {emptyCategory ? (
                  <p
                    style={{
                      fontWeight: "normal",
                      color: "red",
                      fontSize: "13px",
                    }}
                  >
                    Sản phẩm chưa chọn danh mục
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="new-product-form-group">
                <label htmlFor="price_field">Giá gốc</label>
                <input
                  type="text"
                  placeholder="Nhập giá gốc sản phẩm"
                  className={`form-control ${emptyPrice ? "invalid" : ""}`}
                  value={price < 0 ? 0 : price}
                  onChange={(e) => handlePriceChange(e)}
                />
                {emptyPrice ? (
                  <p
                    style={{
                      fontWeight: "normal",
                      color: "red",
                      fontSize: "13px",
                    }}
                  >
                    Sản phẩm chưa có giá gốc
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="new-product-form-group">
              <label htmlFor="name_field">Tên sản phẩm</label>
              <input
                type="text"
                id="name_field"
                placeholder="Nhập tên sản phẩm"
                className={`form-control ${emptyName ? "invalid" : ""}`}
                value={name}
                onChange={(e) => {
                  setEmptyName(false);
                  setName(e.target.value);
                }}
              />
              {emptyName ? (
                <p
                  style={{
                    fontWeight: "normal",
                    color: "red",
                    fontSize: "13px",
                  }}
                >
                  Sản phẩm chưa có tên
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="new-product-textarea">
              <label htmlFor="description_field">Mô tả</label>
              <textarea
                placeholder="Nhập mô tả sản phẩm"
                className={`form-control ${emptyDescription ? "invalid" : ""}`}
                id="description_field"
                rows="8"
                value={description}
                onChange={(e) => {
                  setEmptyDescription(false);
                  setDescription(e.target.value);
                }}
              ></textarea>
              {emptyDescription ? (
                <p
                  style={{
                    fontWeight: "normal",
                    color: "red",
                    fontSize: "13px",
                  }}
                >
                  Sản phẩm chưa có mô tả
                </p>
              ) : (
                ""
              )}
            </div>

            <div className="add-image-1">
              <label>Ảnh sản phẩm (Tối đa 5 hình)</label>
              <div className="group-2">
                <label
                  className={`upload-form-1 ${emptyImages ? "invalid" : ""}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    type="file"
                    name="images"
                    onChange={onChange}
                    multiple
                    hidden
                  />
                  <i class="fa fa-camera" aria-hidden="true"></i>
                  <p>
                    <strong>Kéo Thả </strong>
                    <br></br>hoặc <strong>Nhấn </strong>
                  </p>
                </label>
                <div className="image-container-1">
                  <div className="image-list">
                    {imagesPreview.map((img, index) => (
                      <div className="image-form-1">
                        <label className="image-form-1-elements">
                          <i
                            className="close-1 fa fa-times"
                            onClick={() => handlerImageRemove(index)}
                          ></i>
                          <i
                            className={`change-1  ${
                              selectedImage !== null
                                ? selectedImage != index
                                  ? "fa fa-check-circle-o"
                                  : "fa fa-exchange"
                                : "fa fa-exchange"
                            }`}
                            onClick={() => handlerSwap(index)}
                          ></i>
                        </label>
                        <img
                          src={img}
                          key={index}
                          alt="Images Preview"
                          width={120}
                          height={150}
                          onMouseEnter={() => {}}
                        />
                        <p>Ảnh {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {emptyImages ? (
                <p
                  style={{
                    fontWeight: "normal",
                    color: "red",
                    fontSize: "13px",
                  }}
                >
                  Sản phẩm chưa có ảnh
                </p>
              ) : (
                ""
              )}
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <label htmlFor="sizes_field">Mẫu mã</label>
                <button
                  type="button"
                  className="varient-btn"
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  <i className="fa fa-plus"></i>Thêm
                </button>
              </div>
              {emptyVariants ? (
                <p
                  style={{
                    fontWeight: "normal",
                    color: "red",
                    fontSize: "13px",
                  }}
                >
                  Sản phẩm chưa có mẫu
                </p>
              ) : (
                ""
              )}
              {show && <AddVariant show={setShow} variants={setVariants} />}
              <div className="varient-list">
                {variants &&
                  variants.map((variant, index) => (
                    <Variant
                      key={index}
                      variant={variant}
                      index={index}
                      updateVariant={updateVariant}
                      removeVariant={removeVariant}
                      variantError={setVariantError}
                    />
                  ))}
              </div>
            </div>

            <button type="submit" className="new-product-btn" disabled={load}>
              {load ? "ĐANG THÊM..." : "THÊM SẢN PHẨM"}
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
