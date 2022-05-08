(function($){
    var errorMessage = $('#errorMessage'), searchForm = $('#searchForm'), searchTerm = $('#inputbookname'), showList = $('#showList'), showInfo = $('#show'), homeLink = $('#homeLink');
  $.ajax({
      type: 'get',
      url: "/book/getAll",
      success: function (res) {
          if (res.bookArr.length > 0) {
              errorMessage.hide();
              showList.show();
              homeLink.hide();
              showInfo.hide();
          } else {
              errorMessage.show().html("There are no books available now.");
              showList.hide();
              homeLink.hide();
              showInfo.hide();
              searchForm.hide();

          }
          let showsData = $(res.bookArr);
          for (let i of showsData) {
              let bookId=i._id;
              let newId=bookId.toString()
              showList.append("<li><a href=" +"/book/"+newId+ ">" + i.bookName + "</a></li>");
          }
      }
  });

  searchForm.submit(function (event) {
      event.preventDefault();
      let userInput = searchTerm.val();
      if (!userInput || userInput.trim() === "") {
          errorMessage.show().html("At least enter something. (*^_^*)");
          searchTerm.empty();
          homeLink.show();
          //showList.empty();
          searchTerm.focus();
      } else {
          showList.empty();
          $.ajax({
              type:'post',
              url: '/book/result',
              data:{term:userInput},
              success: function (res) {
                  let tarBooks =res.bookArr;
                  let dataLen = tarBooks.length;
                  if (dataLen > 0) {
                      showList.show();
                      homeLink.show();
                    //  showInfo.hide();
                      errorMessage.hide();
                  } else {
                      errorMessage.show().html("No results found.");
                      showList.hide();
                      homeLink.show();
                      showInfo.hide();
                  }

                  for (let i of tarBooks) {
                      let bookId=i._id;
                      let newId=bookId.toString();
                      showList.append("<li><a href=" +"/book/"+newId+">" + i.bookName + "</a></li>");
                  }
              }
          });
      }
  });
  $("#price").click(function(){
     showList.empty();
     $.ajax({
         type:'post',
         url:'/book/sort',
         data:{term:'price'},
         success:function(res){
             if(!res.bookArr){
                 errorMessage.show().html(res.error)
                 homeLink.show();
             }else{
                 showList.show();
                 homeLink.show();
                 for(let i of res.bookArr){
                    let bookId=i._id;
                    let newId=bookId.toString();
                    showList.append("<li><a href=" +"/book/"+newId+">" + i.bookName+":Price: $"+i.price+"</a></li>")
                 }
             }
             
         }
     })
  });
  $("#time").click(function(){
    showList.empty();
    $.ajax({
        type:'post',
        url:'/book/sort',
        data:{term:'time'},
        success:function(res){
            if(!res.bookArr){
                errorMessage.show().html(res.error);
                homeLink.show();
            }else{
                showList.show();
                homeLink.show();
                for(let i of res.bookArr){
                   let bookId=i.bookId;
                   //let newId=bookId.toString();
                   showList.append("<li><a href=" +"/book/"+bookId+">" + i.bookName+":Publication Date: "+i.publicationDate+ "</a></li>")
                }
            }
            
        }
    })
 });

 $("#rating").click(function(){
    showList.empty();
    $.ajax({
        type:'post',
        url:'/book/sort',
        data:{term:'avgRating'},
        success:function(res){
            if(!res.bookArr){
                errorMessage.show().html(res.error)
                homeLink.show();
            }else{
                showList.show();
                homeLink.show();
                for(let i of res.bookArr){
                   let bookId=i._id;
                   let newId=bookId.toString();
                   showList.append("<li><a href=" +"/book/"+newId+">"+ i.bookName+":Rating: "+i.avgRating+ "</a></li>")
                }
            }
            
        }
    })
 });






 // showList.on('click', 'a', function (event) {
 //     event.preventDefault();
 //     showList.hide();
 //     showInfo.empty();
 //     searchTerm.val("");
 //     showInfo.show();
 //     homeLink.show();
 //     errorMessage.hide();
//  });
  })(window.jQuery);