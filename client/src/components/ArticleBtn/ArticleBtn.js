import React from "react";
import "./ArticleBtn.css";

const ArticleBtn = props => (
  <button className={`article-btn btn btn-${props.btntype} btn-sm`} {...props}>
    {props.children}
  </button>
);

export default ArticleBtn;
