<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/2000/svg">

    <xsl:param name="tabbar_width"/>
    <xsl:param name="tabbar_height"/>
    <xsl:param name="tabbar_upper_color"/>
    <xsl:param name="tabbar_middle_color"/>
    <xsl:param name="tabbar_lower_color"/>
    <xsl:param name="tabbar_etch_color"/>
    <xsl:param name="tabbar_etch_width"/>


    <xsl:template match="/">

        <svg width="{$tabbar_width}" height="{$tabbar_height}" viewBox="0 0 {$tabbar_width} {$tabbar_height}">

            <g>
                <defs>
                    <linearGradient id="background" x1="0" y1="0" x2="0" y2="100%" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stop-color="{$tabbar_upper_color}"/>
                        <stop offset="50%" stop-color="{$tabbar_middle_color}"/>
                        <stop offset="100%" stop-color="{$tabbar_lower_color}"/>
                    </linearGradient>
                </defs>
                <rect
                        fill="url(#background)"
                        stroke="none"
                        x="0"
                        y="0"
                        width="{$tabbar_width}"
                        height="{$tabbar_height}">
                </rect>
                <rect
                        fill="{$tabbar_etch_color}"
                        stroke="none"
                        x="0"
                        y="0"
                        width="{$tabbar_width}"
                        height="{$tabbar_etch_width}" >
                </rect>
            </g>
        </svg>

    </xsl:template>

</xsl:stylesheet>