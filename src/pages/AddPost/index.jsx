import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../Redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null);

  //Проверяет если ли изменения в инпуте(тут только для загрузки фото)
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      //передаем на сервер файл ( в нашем случае картинка)
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert("Ошибка загрузки файла");
    }
  };

  const onClickRemoveImage = () => {
    if (window.confirm("Вы точно хотите удалить?")) setImageUrl("");
  };
  //нужен для библиоткеки SimpleMDE
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        text,
        tags,
      };
      //передаем данные на бекенд
      const { data } = await axios.post("posts", fields);
      const id = data._id;
      navigate(`/posts/${id}`);
    } catch (err) {
      console.warn(err);
      alert("Ошбика при создании статьи!");
    }
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={() => onSubmit()} size="large" variant="contained">
          Опубликовать
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
