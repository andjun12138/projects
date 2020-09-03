package com.jsp.util;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;
import com.google.zxing.qrcode.QRCodeWriter;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class QRCodeUtil {

    public static void encode(String contents,int width,int height,String imgPath) throws IOException, WriterException {

        contents = new String(contents.getBytes("UTF-8"), "ISO-8859-1") ;
        File file = new File(imgPath) ;
        QRCodeWriter writer = new QRCodeWriter() ;
        BitMatrix matrix = writer.encode(contents, BarcodeFormat.QR_CODE, width, height);
        MatrixToImageWriter.writeToFile(matrix, "jpg", file);
    }

    public static String decode(String imgPath) throws IOException, FormatException, ChecksumException, NotFoundException {
        File file = new File(imgPath) ;
        BufferedImage image = ImageIO.read(file);
        LuminanceSource source = new BufferedImageLuminanceSource(image);
        Binarizer binarizer = new HybridBinarizer(source );
        BinaryBitmap imageBinaryBitmap = new BinaryBitmap(binarizer);
        QRCodeReader reader = new QRCodeReader();
        Result result = reader.decode(imageBinaryBitmap);
        System.out.println("resultText = "+ result.getText());
        return result.getText();

    }
}
