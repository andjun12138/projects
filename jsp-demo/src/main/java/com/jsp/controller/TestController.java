package com.jsp.controller;

import com.google.zxing.*;
import com.jsp.BaseEntityService;
import com.jsp.util.BarCodeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.concurrent.ExecutorService;

/**
 * Created by liuxh on 2017/5/31.
 */
@Controller
@RequestMapping(value="/test")
public class TestController {
    @Autowired
    private BaseEntityService baseEntityService;
    @Autowired
    private ExecutorService executorService;

    @RequestMapping("/index")
    public String index() throws IOException, WriterException, FormatException, ChecksumException, NotFoundException {
        //QRCodeUtil.encode("hello word!",200,200,"D:/1.png");
        //QRCodeUtil.decode("D:/1.png");

        BarCodeUtil.encode("12387894525784567890",150,50,"D:/2.png", BarcodeFormat.CODE_39);
        BarCodeUtil.decode("D:/2.png");
        return "/view/success";
    }


}
