import { useState } from "react";
import { toast } from "react-toastify";
import useCreateLabel from "../../hooks/label/useCreateLabel";

const CreateLabelForm = () => {
  const [labelName, setLabelName] = useState("");

  const {
    data: createLabelResponse,
    isLoading: isCreateLabelLoading,
    mutate: createLabel,
  } = useCreateLabel({
    onSuccess: () => {
      setLabelName("");
    },
  });

  const labelOnSubmitHandler = (labelName: string) => {
    if (!labelName) {
      return toast.error("Label name can't be empty");
    }
    createLabel(labelName);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          labelOnSubmitHandler(labelName);
        }}
        className="bg-white px-4 py-4 rounded-md flex gap-2 items-center"
      >
        <input
          type="text"
          onChange={(e) => {
            setLabelName(e.target.value);
          }}
          value={labelName}
          placeholder="add new label"
          className="bg-slate-100 px-2 py-1 focus:outline-none"
        />
        <button
          type="submit"
          className="btn"
        >
          create label
        </button>
      </form>
    </>
  );
};

export default CreateLabelForm;
