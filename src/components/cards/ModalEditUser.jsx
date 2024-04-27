import { useRef, useState, useEffect } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import axios from "axios";

function ModalEditUser({ id, openModal, setOpenModal, onUpdateUser }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState(0);
  const [loading, setLoading] = useState(true);
  const userNameInputRef = useRef(null);

  const fetchUserDetail = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/user/detail/${id}`
      );
      setUserName(response.data.data.name);
      setEmail(response.data.data.email);
      setSelectedRole(response.data.data.role_id);
    } catch (error) {
      console.error("Error fetching User detail:", error);
    }
  };
  const getMasterDynamic = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/data/master/users`
      );
      setRole(response.data.data.roles);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    if (openModal) {
      getMasterDynamic();
      fetchUserDetail();
    }
  }, [openModal]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setUserName("");
    setEmail("");
    setRole([]);
  };

  const updateUser = async () => {
    try {
      await onUpdateUser(id, {
        username: userName,
        email: email,
        role_id: selectedRole,
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Modal
      show={openModal}
      size="md"
      popup
      onClose={handleCloseModal}
      initialFocus={userNameInputRef}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-center text-gray-900 dark:text-white">
            Add New User
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="userName" value="Username" />
            </div>
            <TextInput
              id="userName"
              ref={userNameInputRef}
              placeholder="John Doe"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="John@yopmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="role" value="Role" />
            </div>
            <Select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Choose User Role</option>
              {role.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={updateUser} className="bg-teal-500 hover:bg-teal-800">
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalEditUser;
