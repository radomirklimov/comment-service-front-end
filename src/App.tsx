import { useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { TrashIcon } from "./icons/trash";

interface IComment {
  id: string;
  author: string;
  text: string;
}

enum FormDataType {
  name = "name",
  comment = "comment",
}

interface CommentProps {
  commentData: IComment;
  removeComment: (id: IComment["id"]) => void;
}

const Comment = ({
  commentData: { author, text, id },
  removeComment,
}: CommentProps) => {
  return (
    <div className="comment">
      <div className="comment__content">
        <h5>{author}</h5>
        <p>{text}</p>
      </div>

      <button onClick={() => removeComment(id)}>
        <TrashIcon />
      </button>
    </div>
  );
};

function App() {
  const [comments, setComments] = useState<IComment[]>([]);

  const addNewComment = (comment: Omit<IComment, "id">) => {
    setComments([...comments, { ...comment, id: uuidv4() }]);
  };

  const removeComment = (id: IComment["id"]) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const onSubmit = (f: FormData) => {
    const author = f.get(FormDataType.name);
    const comment = f.get(FormDataType.comment);

    if (!author || !comment) return;

    addNewComment({
      author: author.toString(),
      text: comment.toString(),
    });
  };

  return (
    <main className="content">
      <h1>Commentator</h1>

      <form action={(a) => onSubmit(a)}>
        <h3>Leave a comment</h3>
        <input
          type="text"
          name={FormDataType.name}
          placeholder="Name*"
          required
        />
        <textarea name={FormDataType.comment} placeholder="Comment*" required />

        <button type="submit">Enter</button>
      </form>

      <div className="comments">
        {comments.length
          ? comments.map((c) => (
              <Comment
                key={c.id}
                commentData={c}
                removeComment={removeComment}
              />
            ))
          : "No Comments Here Yet"}
      </div>
    </main>
  );
}

export default App;
