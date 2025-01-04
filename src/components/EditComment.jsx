import React, { useState } from "react";
import { Textarea, Button } from "flowbite-react";

const EditComment = ({ comment, onSave, onCancel }) => {
  const [editedComment, setEditedComment] = useState(comment);

  const handleSave = () => {
    onSave(editedComment);
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={editedComment}
        onChange={(e) => setEditedComment(e.target.value)}
        placeholder="Edit your comment"
      />
      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button color="light" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditComment;
