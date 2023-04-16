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
    successCb: () => {
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
        className="mb-2 flex gap-2"
      >
        <input
          type="text"
          onChange={(e) => {
            setLabelName(e.target.value);
          }}
          value={labelName}
          placeholder="add new label"
        />
        <button type="submit">create label</button>
      </form>
    </>
  );
};

export default CreateLabelForm;
