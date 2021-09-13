import { checkLogin } from 'common/dist/validataion/login'
import React, { useCallback, useMemo, useState } from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const App: React.FC = () => {
  const classes = useStyles();

  // フォームの内容
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // フォームチェック対象であるか (一度触れたフォームをチェック対象とする)
  const [checkName, setCheckName] = useState<boolean>(false)
  const [checkEmail, setCheckEmail] = useState<boolean>(false)
  const [checkPassword, setCheckPassword] = useState<boolean>(false)


  // onChangeでのuseState書き換え
  const changeName = useCallback((event:React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  },[])
  
  const changeEmail = useCallback((event:React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  },[])

  const changePassword = useCallback((event:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  },[])

  // onBlurでフォームチェック対象とする
  const blurName = useCallback(() => {
    setCheckName(true)
  },[])

  const blurEmail = useCallback(() => {
    setCheckEmail(true)
  },[])

  const blurPassword = useCallback(() => {
    setCheckPassword(true)
  },[])

  // 入力チェック
  const checkResults = useMemo(() => {
    const loginInformation = {
      name,
      email,
      password
    }
    return checkLogin(loginInformation)
  },[name,email,password])

  // エラーメッセージ
  const errorNames = useMemo(() => {
    if(checkName){
      return checkResults.filter(result => result.target === 'name')
    }
  },[checkResults,checkName])

  const errorEmails = useMemo(() => {
    if(checkEmail){
      return checkResults.filter(result => result.target === 'email')
    }
  },[checkResults,checkEmail])

  const errorPasswords = useMemo(() => {
    if(checkPassword){
      return checkResults.filter(result => result.target === 'password')
    }
  },[checkResults,checkPassword])
  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {errorNames?.map((error,index) => 
              <Typography key={index} variant="caption" color={'error'}>
                {error.message}
              </Typography>)}
              <TextField
                error={errorNames && errorNames.length > 0}
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                label="Name"
                onChange={changeName}
                onBlur={blurName}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              {errorEmails?.map((error,index) => 
              <Typography key={index} variant="caption" color={'error'}>
                {error.message}
              </Typography>)}
              <TextField
                error={errorEmails && errorEmails.length > 0}
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                onChange={changeEmail}
                onBlur={blurEmail}
              />
            </Grid>
            <Grid item xs={12}>
              {errorPasswords?.map((error,index) => 
              <Typography key={index} variant="caption" color={'error'}>
                {error.message}
              </Typography>)}
              <TextField
                error={errorPasswords && errorPasswords.length > 0}
                variant="outlined"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                onChange={changePassword}
                onBlur={blurPassword}
              />
            </Grid>
          </Grid>
          <Button
            disabled={checkResults.length > 0}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default App