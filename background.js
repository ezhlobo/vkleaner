chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    switch (request.type) {
      case 'set':
        localStorage.setItem(request.name, request.value);
        break;
      case 'get':
        sendResponse(localStorage.getItem(request.name));
        break;
      default:
        sendResponse();
        break;
    }
  }
);
