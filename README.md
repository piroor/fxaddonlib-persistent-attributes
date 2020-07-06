# Persistent Attributes Manager for Firefox 3.6-56

## Usage:

    // for <elem width="..." persist="width"/>
    var width = window['piro.sakura.ne.jp'].persistAttr
                                           .getPersistentAttribute(elem, 'width');
    window['piro.sakura.ne.jp'].persistAttr
                               .removePersistentAttribute(elem, 'width');

