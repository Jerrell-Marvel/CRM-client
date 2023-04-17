import { SetStateAction, useEffect, useRef, useState } from "react";
import { Label } from "../../types/label";
import useUpdateLabel from "../../hooks/label/useUpdateLabel";
import useDeleteLabel from "../../hooks/label/useDeleteLabel";
import { toast } from "react-toastify";

type LabelModalProps = {
  selectedLabel: Label | null;
  setSelectedLabel: React.Dispatch<SetStateAction<Label | null>>;
};
const LabelModal = ({ selectedLabel, setSelectedLabel }: LabelModalProps) => {
  const [isLabelRename, setIsLabelRename] = useState(false);
  const [labelRename, setLabelRename] = useState("");
  const { data: updateLabelResponse, mutate: updateLabel } = useUpdateLabel({
    onSuccess: () => {
      setIsLabelRename(false);
      setLabelRename("");
    },
  });
  const {
    data: deleteLabelResponse,
    isLoading: isDeleteLabelLoading,
    mutate: deleteLabel,
  } = useDeleteLabel({
    onSuccess: () => {
      setSelectedLabel(null);
    },
  });

  const labelRenameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isLabelRename && labelRenameInputRef.current) {
      labelRenameInputRef.current.focus();
    }
  }, [isLabelRename]);

  return (
    <>
      {selectedLabel ? (
        <div>
          <div
            className="fixed top-0 left-0 w-screen h-screen bg-slate-500 bg-opacity-50 flex justify-center items-center"
            // onClick={() => {
            //   setSelectedLabel(null);
            //   setIsLabelRename(false);
            // }}
          ></div>
          <div className="bg-white max-w-3xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col divide-y-2 min-w-[18rem] rounded-lg">
            {isLabelRename ? (
              <div className="px-4 flex justify-center py-2 cursor-pointer">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (!labelRename) {
                      return toast.error("Label name can't be empty");
                    }
                    updateLabel({ labelId: selectedLabel._id, labelName: labelRename });
                  }}
                  className="flex flex-col"
                >
                  <input
                    type="text"
                    value={labelRename}
                    onChange={(e) => setLabelRename(e.target.value)}
                    className="text-center mb-2 bg-slate-100 py-1"
                    placeholder="Enter new label here"
                    ref={labelRenameInputRef}
                  />
                  <button type="submit">Save</button>
                </form>
              </div>
            ) : (
              <div
                className="px-4 flex justify-center py-2 cursor-pointer"
                onClick={() => {
                  setIsLabelRename(true);
                  setLabelRename(selectedLabel.name);

                  // setLabelRename(selectedLabel.name);
                }}
              >
                <p>Rename</p>
              </div>
            )}

            <div
              className="px-4 flex justify-center py-2 cursor-pointer"
              onClick={() => {
                deleteLabel(selectedLabel._id);
              }}
            >
              <p>Delete</p>
            </div>

            <div
              onClick={() => {
                setSelectedLabel(null);
                setIsLabelRename(false);
              }}
              className="px-4 flex justify-center py-2 cursor-pointer"
            >
              <p>Cancel</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default LabelModal;
