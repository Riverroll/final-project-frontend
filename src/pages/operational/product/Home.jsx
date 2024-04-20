import DashboardCard from "../../../components/cards/DashboardCard";
import { FaBox, FaCalendarDay, FaClipboardList, FaTags } from "react-icons/fa";
import Layout from "../../../components/layouts/OperasionalLayout";
import DataTable from "../../../components/tables/DataTable";
import axios from "axios";
import { useState, useEffect } from "react";
import ModalAddProduct from "../../../components/cards/ModalAddProduct";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDate, formatCurrency } from "../../../utils/converter";
import ModalDelete from "../../../components/cards/ModalDelete";
import ModalEdit from "../../../components/cards/ModalEditProduct";
import ModalAddProductType from "../../../components/cards/ModalAddProductType";
import ModalEditProductType from "../../../components/cards/ModalEditProductType";
import ModalEditProductMerk from "../../../components/cards/ModalEditProductMerk";
import ModalAddProductMerk from "../../../components/cards/ModalAddProductMerk";
import ModalDeleteMerk from "../../../components/cards/ModalDelete";
import ModalDeleteType from "../../../components/cards/ModalDelete";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [rowTypes, setRowTypes] = useState([]);
  const [rowMerk, setRowMerk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalProductMerk, setTotalProductMerk] = useState(0);
  const [totalProductType, setTotalProductType] = useState(0);
  const [mostStockProduct, setMostStockProduct] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalMerk, setOpenModalMerk] = useState(false);
  const [openModalType, setOpenModalType] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalTypeDelete, setOpenModalTypeDelete] = useState(false);
  const [openModalMerkDelete, setOpenModalMerkDelete] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
  const [openModalEditProductType, setOpenModalEditProductType] =
    useState(false);
  const [selectedProductMerkId, setSelectedProductMerkId] = useState(null);
  const [openModalEditProductMerk, setOpenModalEditProductMerk] =
    useState(false);
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "product_name", headerName: "Product Name", flex: 1 },
    { field: "product_type", headerName: "Product Type", flex: 1 },
    { field: "product_merk", headerName: "Product Merk", flex: 1 },
    { field: "akl_akd", headerName: "No AKL/AKD", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "stock", headerName: "Stock", flex: 1 },
    { field: "expired_date", headerName: "Expired Date", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-3">
          <button
            className="text-brand-500 hover:text-teal-800 font-bold"
            onClick={() => handleEdit(params.row.product_id)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:text-red-800 font-bold"
            onClick={() => handleToggleModalDelete(params.row.product_id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const columnType = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "type_name", headerName: "Product Type Name", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-3">
          <button
            className="text-brand-500 hover:text-teal-800 font-bold"
            onClick={() => handleEditProductType(params.row.product_type_id)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:text-red-800 font-bold"
            onClick={() =>
              handleModalDeleteProductType(params.row.product_type_id)
            }
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const columnMerk = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "merk_name", headerName: "Product Merk Name", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-3">
          <button
            className="text-brand-500 hover:text-teal-800 font-bold"
            onClick={() => handleEditProductMerk(params.row.product_merk_id)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:text-red-800 font-bold"
            onClick={() =>
              handleModalDeleteProductMerk(params.row.product_merk_id)
            }
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleToggleModalDelete = (id) => {
    setSelectedProductId(id);
    setOpenModalDelete(true);
  };
  const handleModalDeleteProductType = (id) => {
    setSelectedProductTypeId(id);
    setOpenModalTypeDelete(true);
  };
  const handleModalDeleteProductMerk = (id) => {
    setSelectedProductMerkId(id);
    setOpenModalMerkDelete(true);
  };
  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/product/delete/${id}`
      );
      toast.success(response.data.message);
      await fetchData();
      await fetchMasterData();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error deleting product:", error);
      setLoading(false);
    }
  };

  const handleDeleteProductType = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/product/type/delete/${id}`
      );
      toast.success(response.data.message);
      await fetchDataType();
      await fetchMasterData();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error deleting product type:", error);
      setLoading(false);
    }
  };
  const handleDeleteProductMerk = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/product/merk/delete/${id}`
      );
      toast.success(response.data.message);
      await fetchDataMerk();
      await fetchMasterData();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error deleting product merk:", error);
      setLoading(false);
    }
  };
  const handleEdit = (id) => {
    setSelectedProductId(id);
    setOpenModalEdit(true);
  };
  const handleEditProductType = (id) => {
    setSelectedProductTypeId(id);
    setOpenModalEditProductType(true);
  };
  const handleEditProductMerk = (id) => {
    setSelectedProductMerkId(id);
    setOpenModalEditProductMerk(true);
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/all`
      );
      const modifiedData = response.data.data.map((item, index) => ({
        id: index + 1,
        product_id: item.product_id,
        product_name: item.product_name,
        product_type: item.type_name,
        product_merk: item.merk_name,
        akl_akd: item.akl_akd,
        price: formatCurrency(item.price),
        stock: item.stock,
        expired_date: formatDate(item.expired_date),
      }));
      setRows(modifiedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const fetchDataType = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/type/all`
      );
      const modifiedData = response.data.data.map((item, index) => ({
        id: index + 1,
        product_type_id: item.product_type_id,
        type_name: item.type_name,
      }));
      setRowTypes(modifiedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchDataMerk = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/merk/all`
      );
      const modifiedData = response.data.data.map((item, index) => ({
        id: index + 1,
        product_merk_id: item.product_merk_id,
        merk_name: item.merk_name,
      }));
      setRowMerk(modifiedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/master`
      );
      setTotalProduct(response.data.data.totalProduct);
      setTotalProductMerk(response.data.data.totalProductMerk);
      setTotalProductType(response.data.data.totalProductType);
      setMostStockProduct(response.data.data.mostStockProduct);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };
  const handleToggleModalMerk = () => {
    setOpenModalMerk(!openModalMerk);
  };
  const handleToggleModalType = () => {
    setOpenModalType(!openModalType);
  };

  const updateProduct = async (id, newData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/product/update/${id}`,
        {
          name: newData.name,
          aklAkd: newData.aklAkd,
          expiredDate: newData.expiredDate,
          price: newData.price,
          stock: newData.stock,
          productType: newData.productType,
          productMerk: newData.productMerk,
        }
      );
      toast.success(response.data.message);
      await fetchData();
      await fetchMasterData();
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(
          (error) => error.message
        );
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(error.response.data.message || "Failed to create product");
      }
      console.error("Error updating product:", error);
      setLoading(false);
    }
  };

  const updateProductType = async (id, newData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/product/type/update/${id}`,
        {
          typeName: newData.name,
        }
      );
      toast.success(response.data.message);
      await fetchDataType();
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(
          (error) => error.message
        );
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(
          error.response.data.message || "Failed to create product type"
        );
      }
      console.error("Error updating product type:", error);
      setLoading(false);
    }
  };
  const updateProductMerk = async (id, newData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/product/merk/update/${id}`,
        {
          merkName: newData.name,
        }
      );
      toast.success(response.data.message);
      await fetchDataMerk();
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(
          (error) => error.message
        );
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(
          error.response.data.message || "Failed to create product merk"
        );
      }
      console.error("Error updating product merk:", error);
      setLoading(false);
    }
  };
  const handleCreateProduct = async (newProduct) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product/create`,
        newProduct
      );
      toast.success(response.data.message);
      await fetchData();
      await fetchMasterData();
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(
          (error) => error.message
        );
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(error.response.data.message || "Failed to create product");
      }
      console.error("Error creating product:", error);
      setLoading(false);
    }
  };
  const handleCreateProductType = async (newProduct) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product/type/create`,
        newProduct
      );
      toast.success(response.data.message);
      await fetchDataType();
      await fetchMasterData();
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(
          (error) => error.message
        );
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(
          error.response.data.message || "Failed to create product Type"
        );
      }
      console.error("Error creating product type:", error);
      setLoading(false);
    }
  };
  const handleCreateProductMerk = async (newProduct) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product/merk/create`,
        newProduct
      );
      toast.success(response.data.message);
      await fetchDataMerk();
      await fetchMasterData();
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(
          (error) => error.message
        );
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(
          error.response.data.message || "Failed to create product Merk"
        );
      }
      console.error("Error creating product Merk:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
    fetchData();
    fetchDataMerk();
    fetchDataType();
  }, []);

  return (
    <Layout>
      <main className="flex flex-col gap-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 dark:text-gray-400 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Operational
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <a
                  href="#"
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-teal-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                >
                  Products
                </a>
              </div>
            </li>
          </ol>
        </nav>

        <div className="">
          <h1 className="text-3xl pb-3 font-medium">Products Dashboard</h1>
        </div>

        <div className="flex gap-6">
          <DashboardCard
            title="Total Products"
            description={totalProduct}
            icon={FaBox}
          />
          <DashboardCard
            title="Total Product Merk"
            description={totalProductMerk}
            icon={FaCalendarDay}
          />
          <DashboardCard
            title="Total Product Type"
            description={totalProductType}
            icon={FaClipboardList}
          />
          <DashboardCard
            title="Most Stock Product"
            description={mostStockProduct}
            icon={FaTags}
          />
        </div>
        <div className="mt-3">
          <div className="flex justify-between pt-3 pb-4 ">
            <h3 className="text-2xl  font-medium">Product List</h3>
            <div className="flex justify-end gap-3 ">
              <button
                onClick={handleToggleModal}
                className="flex items-center text-white bg-teal-500 hover:bg-teal-800 font-bold p-3 border rounded-full"
              >
                Add Product
                <svg
                  className=" ml-2 h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>
          <DataTable rows={rows} columns={columns} loading={loading} />
        </div>

        <div className="mt-5">
          <div className="flex justify-between pt-3 pb-4 ">
            <h3 className="text-2xl  font-medium">Product Type List</h3>
            <div className="flex justify-end gap-3 ">
              <button
                onClick={handleToggleModalType}
                className="flex items-center text-white bg-teal-500 hover:bg-teal-800 font-bold p-3 border rounded-full"
              >
                Add Product Type
                <svg
                  className=" ml-2 h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>
          <DataTable rows={rowTypes} columns={columnType} loading={loading} />
        </div>

        <div className="mt-5">
          <div className="flex justify-between pt-3 pb-4 ">
            <h3 className="text-2xl  font-medium">Product Merk List</h3>
            <div className="flex justify-end gap-3 ">
              <button
                onClick={handleToggleModalMerk}
                className="flex items-center text-white bg-teal-500 hover:bg-teal-800 font-bold p-3 border rounded-full"
              >
                Add Product Merk
                <svg
                  className=" ml-2 h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>
          <DataTable rows={rowMerk} columns={columnMerk} loading={loading} />
        </div>

        <ModalAddProduct
          openModal={openModal}
          setOpenModal={setOpenModal}
          onCreateProduct={handleCreateProduct}
        />
        <ModalDelete
          id={selectedProductId}
          onDeleteComponent={handleDeleteProduct}
          open={openModalDelete}
          onClose={() => setOpenModalDelete(false)}
        />
        <ModalEdit
          id={selectedProductId}
          onEditProduct={updateProduct}
          open={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
        />

        <ModalAddProductMerk
          openModal={openModalMerk}
          setOpenModal={setOpenModalMerk}
          onCreateProductMerk={handleCreateProductMerk}
        />
        <ModalAddProductType
          openModal={openModalType}
          setOpenModal={setOpenModalType}
          onCreateProductType={handleCreateProductType}
        />
        <ModalEditProductType
          id={selectedProductTypeId}
          onUpdateProductType={updateProductType}
          openModal={openModalEditProductType}
          setOpenModal={setOpenModalEditProductType}
        />
        <ModalEditProductMerk
          id={selectedProductMerkId}
          onUpdateProductMerk={updateProductMerk}
          openModal={openModalEditProductMerk}
          setOpenModal={setOpenModalEditProductMerk}
        />
        <ModalDeleteType
          id={selectedProductTypeId}
          onDeleteComponent={handleDeleteProductType}
          open={openModalTypeDelete}
          onClose={() => setOpenModalTypeDelete(false)}
        />
        <ModalDeleteMerk
          id={selectedProductMerkId}
          onDeleteComponent={handleDeleteProductMerk}
          open={openModalMerkDelete}
          onClose={() => setOpenModalMerkDelete(false)}
        />
      </main>
    </Layout>
  );
}
