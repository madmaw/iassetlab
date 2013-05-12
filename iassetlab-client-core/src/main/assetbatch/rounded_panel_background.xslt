<xsl:stylesheet version="1.1"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">


    <xsl:param name="rounded_panel_width"/>
    <xsl:param name="rounded_panel_height"/>
    <xsl:param name="rounded_panel_rounding"/>
    <xsl:param name="rounded_panel_color"/>

    <xsl:template match="/">

        <xsl:param name="width" select="$rounded_panel_width"/>
        <xsl:param name="height" select="$rounded_panel_height"/>

        <svg width="{$width}" height="{$height}" viewBox="0 0 {$width} {$height}">
            <g>
                <rect x="0" y="0" width="{$width}" height="{$height}" rx="{$rounded_panel_rounding}" ry="{$rounded_panel_rounding}" fill="{$rounded_panel_color}"/>
            </g>
        </svg>

    </xsl:template>
</xsl:stylesheet>