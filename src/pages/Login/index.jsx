import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "../../Redux/slices/auth";
import { Navigate } from "react-router-dom";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    //валидация происходит только в том случае если поменялись поля
    // mode: "onChange",
  });

  //Будет выполняться в том случае если реакт хукформ понял что валидация прошла коректно
  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    } else {
      alert("Не удалось авторизоваться");
    }
  };

  React.useEffect(() => {}, []);

  if (isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register("email", { required: "Укажите почту" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          error={Boolean(errors.password?.message)}
          label="Пароль"
          helperText={errors.password?.message}
          {...register("password", { required: "Укажите пароль" })}
          fullWidth
        />
        <Button
          disabled={isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Войти
        </Button>
      </form>
    </Paper>
  );
};
