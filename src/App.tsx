import { useEffect, useState } from "react";
import "./App.css";
import { TrashIcon } from "./icons/trash";
import axios from 'axios';

interface IComment {
  id: number;
  author: string;
  text: string;
}

let commentId = 1;

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

function addToDatabase(comment: Omit<IComment, "id">): Promise<void> {
  return fetch("http://localhost:8080/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(comment),
  }).then((res) => console.log("got response:", res));
}

function removeFromDatabase(id: Number){
  return fetch("http://localhost:8080/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(id),
  }).then((res) => console.log("got response:", res));
}

function getAllFromDatabase(): Promise<IComment[]> {
  return fetch("http://localhost:8080/get-all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }) 
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  });
}

function App() {
  const [comments, setComments] = useState<IComment[]>([]);

  const addNewComment = (comment: Omit<IComment, "id">) => {
    setComments([...comments, { ...comment, id: commentId++ }]);
  };


  const removeComment = (id: IComment["id"]) => {
    console.log(id)
    removeFromDatabase(id)

    setComments(comments.filter((c) => c.id !== id));
  };

  const onSubmit = (f: FormData) => {
    const author = f.get(FormDataType.name);
    const comment = f.get(FormDataType.comment);

    if (!author || !comment) return;

    const newComment = {
      author: author.toString(),
      text: comment.toString(),
    };
  
    addNewComment(newComment);

    addToDatabase(newComment);

  };

  useEffect(() => {
    getAllFromDatabase()
      .then((data) => {
        setComments(data); 
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, []);

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
