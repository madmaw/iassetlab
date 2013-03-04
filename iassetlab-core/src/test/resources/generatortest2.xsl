<xsl:stylesheet version="1.1"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/2000/svg">

    <xsl:output method="xml"/>

    <xsl:param name="fill-color">#00ff00</xsl:param>

    <xsl:template match="/">
        <xsl:variable name="width">64</xsl:variable>
        <xsl:variable name="height" select="$width"/>

        <svg width="{$width}" height="{$height}" viewBox="{-$width div 2} {-$height div 2} {$width} {$height}">
            <g>
                <rect fill="{$fill-color}" stroke-width="3" stroke="black"
                         x="{$width div 4}" y="{$height div 4}" width="{$width div 2}" height="{$height div 2}" />
            </g>
        </svg>
    </xsl:template>

</xsl:stylesheet>
