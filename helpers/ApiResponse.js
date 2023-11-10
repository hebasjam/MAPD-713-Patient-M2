exports.successResponse = function (res, msg) {

    const resData = {
        status: 0,
        message: msg
    };
    res.send(200, resData);
};

exports.successResponseWithData = function (res, msg, data) {
    const resData = {
        status: 0,
        message: msg,
        data: data
    };
    res.send(200, resData);

};

exports.ErrorResponse = function (res, msg) {
    var data = {
        status: 0,
        message: msg,
    };
    res.send(400, data);
};

exports.notFoundResponse = function (res, msg) {
    // var data = {
    //     status: 0,
    //     message: msg,
    // };
    // return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
    var resData = {
        status: 0,
        message: msg,
        data: data
    };
    res.send(400, resData);
};

exports.unauthorizedResponse = function (res, msg) {
    // var data = {
    //     status: 0,
    //     message: msg,
    // };
    // return res.send(401,data);
};