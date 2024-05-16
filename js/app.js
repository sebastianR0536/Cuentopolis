var config = {
    apiKey: "AIzaSyDdE1ReaIOr_OAGOjc9xglzpZSOCOuSts0",
    authDomain: "conchita-344a5.firebaseapp.com",
    databaseURL: "https://conchita-344a5.firebaseio.com",
    projectId: "conchita-344a5",
    storageBucket: "conchita-344a5.appspot.com",
    messagingSenderId: "442852674055"
};
firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
$('#google').click(function() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        guardaDatos(result.user)
    })
})



function guardaDatos(user) {
    var usuario = {
        uid: user.uid,
        nombre: user.displayName,
    }
    firebase.database().ref("usuarios/" + user.uid).set(usuario)
    localStorage.user = user.displayName
}



function mostrarDatos() {
    firebase.database().red("usuarios").get()
}

var $signUp = $('#sign-up').click(signUp);

function signUp(e) {
    e.preventDefault();
    var $email = $('#email').val();
    var $password = $('#password').val();
    // console.log($email);
    // console.log($password);
    firebase.auth().createUserWithEmailAndPassword($email, $password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // console.log(errorCode);
            // console.log(errorMessage);

            // ...
        });
}


/*$(document).ready(function() {
    $('.slider').slider();
    $('a').click(paintModal)
});*/

$(document).ready(loadPage)

function loadPage() {

    $('.slider').slider();
    $.getJSON('https://www.googleapis.com/books/v1/volumes?q="cuentos+niños"&maxResults=40&langRestrict=es', function(data) {
        paintBookCard(data)
    });

    /*
        $.getJSON('https://www.googleapis.com/books/v1/volumes?q="cochinitos"&maxResults=10&langRestrict=es', function(data) {
            paintBookCard(data)
        });
        
        
        $.getJSON('https://www.googleapis.com/books/v1/volumes?q="herweck+rice"&maxResults=10&langRestrict=es', function(data) {
            paintBookCard(data)
        });
        $.getJSON('https://www.googleapis.com/books/v1/volumes?q="sarah+kartchner"&maxResults=10&langRestrict=es', function(data) {
            paintBookCard(data)
        });
        */
    $('#search-book').keyup(filterBooks)
    $('.modal').modal();

}

function paintBookCard(data) {
    for (var i = 0; i < data['items'].length; i++) {
        if (data['items'][i]['volumeInfo']['imageLinks']) {
            var $bookImage = $('<img />', { 'class': 'pic' }).attr('src', data['items'][i]['volumeInfo']['imageLinks']['smallThumbnail'])
            var $bookDiv = $('<div />', { 'class': 'book-card' })
            var $bookLink = $('<a />', { 'class': 'waves-effect waves-light modal-trigger open-modal' })
            $bookLink.attr('href', '#modal1')
            var $title = $('<h3 />', { 'class': 'title' }).text(data['items'][i]['volumeInfo']['title'])
            var $date = $('<p />', { 'class': 'date' }).text(data['items'][i]['volumeInfo']['publishedDate'])
            if (data['items'][i]['volumeInfo']['authors']) {
                var $author = $('<p />', { 'class': 'author' }).text(data['items'][i]['volumeInfo']['authors'][0])
            }
            $('#wrapper').append($bookDiv)
            $bookDiv.append($bookLink)
            $bookLink.append($bookImage)
            $bookLink.append($title)
            $bookLink.append($author)
            $bookLink.append($date)
        }
    }
    $('.open-modal').click(paintModal)
    $('.open-modal').click(paintReviews)


}


function filterBooks() {
    var search = $('#search-book').val().trim().toLowerCase();
    $('h3').each(function() {
        if ($(this).text().toLowerCase().indexOf(search) === -1) {
            $(this).closest('div').hide()
        } else {
            $(this).closest('div').show()
        }
    })
}


function paintModal() {
    var $img = $(this).find('.pic').attr('src')
    var $author = $(this).find('.author').text()
    var $title = $(this).find('.title').text()
    var $date = $(this).find('.date').text()
    $('#pic').attr('src', $img)
    $('#author').text($author)
    $('#title').text($title)
    $('#date').text($date)
}

$('#send-review').click(sendReview)

function sendReview() {
    bookId = new Date().getTime();
    var title = $(this).siblings('h3').text()
    var review = $('#write-review').val()

    $('#write-review').val('')
    firebase.database().ref("reviews/" + bookId).set({
        title: title,
        review: review
    })
}


function paintReviews() {
    $('#reviews').empty()
    var reviews = firebase.database().ref("reviews/");
    reviews.on("value", function(snapshot) {
        $('#reviews').empty();
        var $title = $('.modal-content #title').text();
        var obj = snapshot.val()
        for (var i in obj) {
            if ($title === obj[i]['title']) {
                var $reviewDiv = $('<p />').text(obj[i]['review'])
                $('#reviews').append($reviewDiv)
            }
        }
    })
}
