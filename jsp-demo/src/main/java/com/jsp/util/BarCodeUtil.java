package com.jsp.util;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class BarCodeUtil {

    public static void encode(String contents,int width,int height,String imgPath,BarcodeFormat barcodeFormat) throws IOException, WriterException {

        int codeWidth = 3 +( 7 * 6 ) + 5 + ( 7 * 6 ) +3;
        codeWidth = Math.max(codeWidth, width);//为了显示好点，与系统默认的比较取大的
        BitMatrix bitMatrix = new MultiFormatWriter().encode(contents,
                barcodeFormat, codeWidth, height, null);
        MatrixToImageWriter
                .writeToFile(bitMatrix, "png", new File(imgPath));
    }

    public static String decode(String imgPath) throws IOException, NotFoundException {
        BufferedImage image = null;
        Result result = null;
        image = ImageIO.read(new File(imgPath));
        if (image == null) {
            System.out.println("the decode image may be not exit.");
        }
        LuminanceSource source = new BufferedImageLuminanceSource(image);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
        result = new MultiFormatReader().decode(bitmap, null);
        System.out.println("resultText = "+ result.getText());
        return result.getText();

    }

}
