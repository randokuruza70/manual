<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="html" encoding="UTF-8"/>
  <!-- //////////////Cross Browser(WebKit)///////////////////////////////////////////// -->

  <xsl:variable name="const_title">Power Source -Matrix Chart-</xsl:variable>

  <xsl:variable name="const_order_capacity">Capacity</xsl:variable>

  <xsl:variable name="const_order_name">Name</xsl:variable>

  <xsl:variable name="const_fuse">Fuse</xsl:variable>

  <xsl:variable name="const_system">System</xsl:variable>
  <!-- ////////////////////////////////////////////////////////////////// -->

  <xsl:template match="/">
    <div id="ps_matrix"><xsl:apply-templates select="LoadList"/></div>
  </xsl:template>

  <xsl:template match="LoadList"><xsl:variable name="objId" select="@objId"/>
    <table class="p_table">

      <xsl:apply-templates select="Block"><xsl:with-param name="objId" select="$objId"/></xsl:apply-templates>
    </table>
  </xsl:template>

  <xsl:template match="Block"><xsl:apply-templates select="@list"/></xsl:template>

  <xsl:template match="@list">

    <xsl:param name="objId"></xsl:param>
    <tr>
      <td colspan="3" class="gray" width="900">

        <xsl:call-template name="displayButton"><xsl:with-param name="attri" select="../@code"/><xsl:with-param name="value" select="../blockname/text()"/><xsl:with-param name="objId" select="$objId"/></xsl:call-template>
      </td>
    </tr>
    <tr>
      <td class="gray2" colspan="2"><xsl:value-of select="$const_fuse"/></td>
      <td class="gray2"><xsl:value-of select="$const_system"/></td>
    </tr>

    <xsl:apply-templates select="../Fuse"><xsl:with-param name="objId" select="$objId"/><xsl:sort select="@capacity" order="ascending" data-type="number"/></xsl:apply-templates>
    <tr>
      <td colspan="3" height="30"></td>
    </tr>
  </xsl:template>

  <xsl:template match="Fuse"><xsl:param name="objId"/>
    <TR>
      <TD class="gray3"><xsl:value-of select="@capacity"/>A</TD>
      <TD class="gray3"><xsl:value-of select="name"/></TD>
      <TD class="gray4_no_text">

        <xsl:for-each select="refs/System"><xsl:sort select="." data-type="text" order="ascending"/>
          <div class="loads-link">
            <span class="loads_ref">

              <xsl:attribute name="onMouseOver"><xsl:value-of select="$objId"/>E1P.EeO(true)</xsl:attribute>

              <xsl:attribute name="onMouseOut"><xsl:value-of select="$objId"/>E1P.EeS()</xsl:attribute>

              <xsl:attribute name="onClick"><xsl:value-of select="$objId"/>E1.E1K('<xsl:value-of select="./@code"/>','<xsl:value-of select="../../@code"/>','<xsl:value-of select="../../@type"/>')</xsl:attribute><!--<xsl:attribute name="onMouseOver"><xsl:value-of select="$objId" />n_call_runOnMouseOverProc(this)</xsl:attribute><xsl:attribute name="onMouseOut"><xsl:value-of select="$objId" />n_call_runOnMouseOutProc(this)</xsl:attribute>--><xsl:value-of select="."/></span>
          </div>
        </xsl:for-each>
      </TD>
    </TR>
  </xsl:template>

  <xsl:template name="displayButton"><xsl:param name="attri"/><xsl:param name="value"/><xsl:param name="objId"/><xsl:param name="attriBefore" select="substring-before($attri,';')"/><xsl:param name="attriAfter" select="substring-after($attri,';')"/><xsl:param name="valueBefore" select="substring-before($value,';')"/><xsl:param name="valueAfter" select="substring-after($value,';')"/>

    <xsl:choose>

      <xsl:when test="$valueBefore != '' ">

        <xsl:call-template name="BlockName"><xsl:with-param name="id" select="$attriBefore"/><xsl:with-param name="name" select="$valueBefore"/><xsl:with-param name="objId" select="$objId"/></xsl:call-template>

        <xsl:call-template name="displayButton"><xsl:with-param name="attri" select="$attriAfter"/><xsl:with-param name="value" select="$valueAfter"/><xsl:with-param name="objId" select="$objId"/></xsl:call-template>
      </xsl:when>

      <xsl:otherwise>

        <xsl:call-template name="BlockName"><xsl:with-param name="id" select="$attri"/><xsl:with-param name="name" select="$value"/><xsl:with-param name="objId" select="$objId"/></xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="BlockName"><xsl:param name="id"/><xsl:param name="name"/><xsl:param name="objId"/>
    <input type="button" class="font_en">

      <xsl:attribute name="id"><xsl:value-of select="$objId"/><xsl:value-of select="$id"/></xsl:attribute>

      <xsl:attribute name="onClick"><xsl:value-of select="$objId"/>E1.E1H('<xsl:value-of select="$id"/>')</xsl:attribute>

      <xsl:attribute name="value"><xsl:value-of select="$name"/></xsl:attribute>
    </input>
  </xsl:template>
</xsl:stylesheet>
