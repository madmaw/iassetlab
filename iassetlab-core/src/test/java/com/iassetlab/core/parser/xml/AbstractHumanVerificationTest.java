package com.iassetlab.core.parser.xml;

import org.junit.Assert;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 9:06 PM
 * To change this template use File | Settings | File Templates.
 */
public class AbstractHumanVerificationTest {
    protected void doHumanVerification(byte[] frame) {
        final JDialog f = new JDialog();
        final boolean[] b = new boolean[1];
        JPanel p = new JPanel(new GridLayout(3, 1));
        f.setContentPane(p);
        JLabel i = new JLabel(new ImageIcon(frame));
        p.add(i);
        JButton b1 = new JButton("Yes");
        b1.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                f.dispose();
            }
        });
        JButton b2 = new JButton("No");
        b2.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                b[0] = true;
                f.dispose();
            }
        });
        p.add(b1);
        p.add(b2);
        f.setModal(true);
        f.pack();
        f.setVisible(true);
        if( b[0] ) {
            Assert.fail("invalid image");
        }
    }

}
