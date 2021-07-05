// noinspection HtmlUnknownTarget
const supp_content=`
<div id="suppBox" class="hidden"></div>
`;

document.body.innerHTML = supp_content + document.body.innerHTML;
(async () => await load_scripts({
	'js/supplemental_bar.js': {}
}))();

document.querySelector("script[src*='supp_template.js']").remove();
