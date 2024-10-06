const Modal = ({
  isOpen,
  closeModal,
  children,
}: {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <button onClick={closeModal} className="absolute top-2 right-2">
          Close
        </button>
        {children}
      </div>
    </div>
  );
};
