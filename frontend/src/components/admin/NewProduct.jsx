import React, { Fragment, useState, useEffect, useCallback } from "react";
import MetaData from "../layout/MetaData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  newProduct,
  clearErrors,
  uploadImages,
} from "../../actions/productActions";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";
import { getCategoryAll } from "../../actions/categoryActions";
import RichTextEditor from "../layout/RichTextEditor";
import ImagesList from "./layout/ImagesList";
import Selections from "./product/Selections";
import Variant from "./product/Variant";

const NewProduct = () => {
  const { loading, error, success } = useSelector((state) => state.newProduct);
  const {
    loading: categoryLoading,
    error: categoryError,
    categories,
  } = useSelector((state) => state.category);

  const history = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [variants, setVariants] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectionNumber, setSelectionNumber] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [emptyPrice, setEmptyPrice] = useState(false);
  const [emptyName, setEmptyName] = useState(false);
  const [emptyDescription, setEmptyDescription] = useState(false);
  const [emptyCategory, setEmptyCategory] = useState(false);
  const [emptyImages, setEmptyImages] = useState(false);
  const [emptyVariants, setEmptyVariants] = useState(false);
  const [variantError, setVariantError] = useState(false);
  const [load, setLoad] = useState(false);

  const units = [
    { English: "size", vietnamese: "Kích cỡ" },
    { English: "length", vietnamese: "Độ dài" },
    { English: "weight", vietnamese: "Khối lượng" },
    { English: "capacity", vietnamese: "Dung tích" },
    { English: "area", vietnamese: "Diện tích" },
    { English: "storage_capacity", vietnamese: "Dung lượng lưu trữ" },
    { English: "processing_speed", vietnamese: "Tốc độ xử lý" },
    { English: "screen_resolution", vietnamese: "Độ phân giải màn hình" },
    { English: "screen_size", vietnamese: "Kích thước màn hình" },
    { English: "power", vietnamese: "Công suất" },
    { English: "battery_capacity", vietnamese: "Dung lượng pin" },
    { English: "time", vietnamese: "Thời gian" },
    { English: "temperature", vietnamese: "Nhiệt độ" },
  ];

  const unitValues = {
    size: ["XS", "S", "M", "L", "Xl", "XXL", "XXXL"],
    length: ["m", "cm", "mm", "km", "mile", "yard", "foot", "inch"],
    weight: ["mg", "g", "kg", "ton", "ounce", "pound"],
    capacity: ["ml", "l", "m3", "cm3", "gallon"],
    area: ["mm2", "cm2", "m2", "km2", "inch2", "feet2", "acre", "hectare"],
    storage_capacity: ["KB", "MB", "GB", "TB"],
    processing_speed: ["MHz", "GHz"],
    screen_resolution: ["px (pixels)"],
    screen_size: ["inch"],
    power: ["W (watt)", "kW"],
    battery_capacity: ["mAh"],
    time: ["second", "minute", "hour", "day", "week", "month", "year"],
    temperature: ["oC", "oF", "K"],
  };

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
      history("/admin/products");
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
          setImagesPreview((oldArray) => [
            ...oldArray,
            {
              name: file.name,
              url: reader.result,
              size: file.size,
              type: file.type,
            },
          ]);
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
    let inputValue = e.target.value.replace(/\./g, "");
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

  const handlerAddZero = (zero) => {
    setPrice((prev) => {
      if (prev === "") {
        return "";
      }
      return prev * zero;
    });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("de-DE").format(value);
  };

  const openHelpWindow = (e) => {
    e.preventDefault();
    window.open("/help/on-choices-pick", "_blank", "noopener,noreferrer");
  };

  const handlerSelectionNumber = (number) => {
    setSelectionNumber(number);
  };

  return (
    <Fragment>
      <MetaData title={"Add Product"} />
      <div className="admin-layout-1">
        <div className="admin-container-1">
          <div className="chart-container-1">
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
            </div>
            <div className="new-product-form-group-1">
              <label htmlFor="name_field">Mô tả</label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>
          </div>
          <div className="chart-container-1">
            <div className="new-product-form-group-2">
              <label>Các lựa chọn </label>
              <Selections selectionNumber={selectionNumber} />
            </div>
          </div>
          <div className="chart-container-1">
            <div className="new-product-form-group-2">
              <label>Ảnh </label>
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
                <i className="fa fa-camera" aria-hidden="true"></i>
                <p>
                  <strong>Kéo Thả </strong>
                  ảnh hoặc <strong>Nhấp Chuột</strong> để chọn ảnh trên máy
                </p>
                <button>Thêm ảnh bằng url</button>
              </label>
            </div>
            <ImagesList imagesPreview={imagesPreview} />
          </div>
        </div>

        <div className="admin-container-1">
          <div className="chart-container-1">
            <div className="new-product-form-group-3">
              <label htmlFor="name_field">Danh mục</label>
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
            </div>
            <div className="new-product-form-group-3">
              <label htmlFor="name_field">Giá gốc</label>
              <div className="horizontal-3">
                <input
                  type="text"
                  placeholder="Nhập giá gốc"
                  className={`form-control ${emptyPrice ? "invalid" : ""}`}
                  value={price ? formatPrice(price) : ""}
                  onChange={(e) => handlePriceChange(e)}
                />
                <div className="btns-of-zero">
                  <button onClick={() => handlerAddZero(1000)}>.000</button>
                  <button onClick={() => handlerAddZero(100)}>.00</button>
                  <button onClick={() => handlerAddZero(10)}>.0</button>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-container-1">
            <div className="new-product-form-group-3">
              <label htmlFor="question_field">
                Loại phép chọn{" "}
                <i
                  className="fa fa-question-circle"
                  onClick={(e) => openHelpWindow(e)}
                ></i>
              </label>
              <div className="btns-of-zero">
                <input
                  type="radio"
                  id="red"
                  onChange={() => handlerSelectionNumber(0)}
                  checked={selectionNumber === 0}
                />
                <label htmlFor="red">Không</label>

                <input
                  type="radio"
                  id="green"
                  onChange={() => handlerSelectionNumber(1)}
                  checked={selectionNumber === 1}
                />
                <label htmlFor="green">Đơn vị</label>

                <input
                  type="radio"
                  id="blue"
                  onChange={() => handlerSelectionNumber(2)}
                  checked={selectionNumber === 2}
                />
                <label htmlFor="blue">Mẫu và đơn vị</label>
              </div>

              <div className="new-product-form-group-3">
                <label htmlFor="selection_field">Chọn loại đơn vị</label>
                <select
                  className={`form-control `}
                  id="second_selection_field"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                >
                  <option value="">Chọn một đơn vị</option>
                  {units.map((unit, index) => (
                    <option key={index} value={unit.English}>
                      {unit.vietnamese}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="chart-container-1">
            <div className="new-product-form-group-4">
              <label htmlFor="selection_field">Chọn loại đơn vị</label>
              <Variant
                selectedUnit={selectedUnit}
                unitValues={unitValues[selectedUnit]}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
