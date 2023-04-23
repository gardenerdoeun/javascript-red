let firebaseUser
firebase.auth().onAuthStateChanged(function(_firebaseUser) {
    console.log(firebaseUser); // 로그인이 안 됐을 땐 null 값 반환
    firebaseUser = _firebaseUser;
    if (firebaseUser) {
        document.getElementById('login-guest').style.display = 'none';
        document.getElementById('login').style.display = 'none';
        document.getElementById('hello').style.display = 'block';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('hello').innerHTML = 'Hello ' + firebaseUser.email + '!';
        document.getElementById('menu-a-items').style.display = 'inline';
        document.getElementById('menu-a-groceries').style.display='inline';
        document.getElementById('menu-groceries-counter').style.display = 'flex';
        firebaseAfterLogin();
    } else {
        document.getElementById('login-guest').style.display = 'block';
        document.getElementById('login').style.display = 'block';
        document.getElementById('hello').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('menu-a-items').style.display = 'none';
        document.getElementById('menu-a-groceries').style.display='none';
        document.getElementById('menu-groceries-counter').style.display='none';
        
        if(document.location.pathname !== '/' && document.location.pathname !== '/index.html'){
            document.location.href='/';
        }
    //   document.getElementById('login-display').innerHTML = '';
    }
  });
  
  const googleLogout = function() {
    firebase.auth().signOut();
  };
  
  const googleLogin = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };
  
  const emailSignUp = function(form) {
    const email = form['signUp-email'].value
    const password = form['signUp-password'].value
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      console.error(error);
      alert(error.message);
    });
  };
  
  const emailSignIn = function(form) {
    const email = form['signIn-email'].value
    const password = form['signIn-password'].value
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      console.error(error);
      alert(error.message);
    });
  };

  const guestSignIn = function() {
    const email = 'guest@guest.com';
    const password = 'guestguest';
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      console.error(error);
      alert(error.message);
    });
  };