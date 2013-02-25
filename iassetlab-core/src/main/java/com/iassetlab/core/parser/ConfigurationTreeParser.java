package com.iassetlab.core.parser;

import com.iassetlab.core.ConfigurationTree;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 3:28 PM
 * To change this template use File | Settings | File Templates.
 */
public interface ConfigurationTreeParser {

    ConfigurationTree parse(DataPath path) throws IOException, ConfigurationParseException;
}
