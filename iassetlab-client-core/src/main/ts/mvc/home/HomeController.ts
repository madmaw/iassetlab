///<reference path="IHomeControllerModel.ts"/>

///<reference path="../../../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/AbstractJQueryController.ts"/>

// Module
module iassetlab.client.core.mvc.home {

    // Class
    export class HomeController extends templa.mvc.element.jquery.AbstractJQueryController {

        public static _selectorAbout = ".home_item_about";
        public static _selectorSearch = ".home_item_search";
        public static _selectorBrowse = ".home_item_browse";

        private static _selectors = [HomeController._selectorAbout, HomeController._selectorSearch, HomeController._selectorBrowse];
        private static _displayedClass = "displayed";

        // Constructor
        constructor(viewFactory:templa.mvc.element.IElementViewFactory) {
            super(viewFactory);
        }

        public _doStart(): bool {
            var model:IHomeControllerModel = <any>this.getModel();
            for (var i in HomeController._selectors) {
                var selector = HomeController._selectors[i];
                // get around scoping problems
                this.$(selector).click(function (s:string) {
                    return function () {
                        model.requestDisplayOption(s);
                    };
                }(selector));
            }
            return true;
        }

        public _doLoad(model: templa.mvc.IModel) {
            var homeModel: IHomeControllerModel = <any>this.getModel();
            for (var i in HomeController._selectors) {
                var selector = HomeController._selectors[i];
                
                var jquery = this.$(selector);
                if (selector == homeModel.displayedOption) {
                    if (!jquery.hasClass(HomeController._displayedClass)) {
                        jquery.addClass(HomeController._displayedClass);
                    }
                } else {
                    this.$(selector).removeClass(HomeController._displayedClass);
                }
            }
        }

    }

}