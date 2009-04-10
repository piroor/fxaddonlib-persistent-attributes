/*
 Animation Task Manager

 Usage:
   window['piro.sakura.ne.jp'].animationManager.addTask(
     function(aTime, aBeginningValue, aTotalChange, aDuration) {
       // some animation task runned by interval
       var current = someEasingFunction(aTime, aBeginningValue, aTotalChange, aDuration);
       target.style.left = current+'px';
       return aTime > aDuration; // return true if the animation finished.
     },
     100, // beginning
     200, // total change (so, the final value will be 100+200=300)
     250  // msec, duration
   );
   // stop all
   window['piro.sakura.ne.jp'].animationManager.stop();

 lisence: The MIT License, Copyright (c) 2009 SHIMODA "Piro" Hiroshi
   http://www.cozmixng.org/repos/piro/fx3-compatibility-lib/trunk/license.txt
 original:
   http://www.cozmixng.org/repos/piro/fx3-compatibility-lib/trunk/animationManager.js
*/
(function() {
	const currentRevision = 3;

	if (!('piro.sakura.ne.jp' in window)) window['piro.sakura.ne.jp'] = {};

	var loadedRevision = 'animationManager' in window['piro.sakura.ne.jp'] ?
			window['piro.sakura.ne.jp'].animationManager.revision :
			0 ;
	var tasks = !loadedRevision ? [] : window['piro.sakura.ne.jp'].animationManager.tasks ;
	if (loadedRevision && loadedRevision > currentRevision) {
		return;
	}

	var Cc = Components.classes;
	var Ci = Components.interfaces;

	if (tasks.length)
		window['piro.sakura.ne.jp'].animationManager.stop();

	window['piro.sakura.ne.jp'].animationManager = {
		revision : currentRevision,

		addTask : function(aTask, aBeginningValue, aFinalValue, aDuration) 
		{
			if (!aTask) return;
			this.tasks.push({
				task      : aTask,
				start     : Date.now(),
				beginning : aBeginningValue,
				change    : aTotalChange,
				duration  : aDuration
			});
			if (this.tasks.length > 1) return;
			this.stop();
			this.timer = window.setInterval(
				this.onAnimation,
				this.interval,
				this
			);
		},

		removeTask : function(aTask) 
		{
			if (!aTask) return;
			var task;
			for (var i in this.tasks)
			{
				task = this.tasks[i];
				if (task.task != aTask) continue;
				delete task.task;
				delete task.start;
				delete task.beginning;
				delete task.change;
				delete task.duration;
				this.tasks.splice(i, 1);
				break;
			}
			if (!this.tasks.length)
				this.stop();
		},

		stop : function() 
		{
			if (!this.timer) return;
			window.clearInterval(this.timer);
			this.timer = null;
		},

		tasks    : tasks,
		interval : 10,
		timer    : null,

		onAnimation : function(aSelf) 
		{
			// task should return true if it finishes.
			var now = Date.now();
			aSelf.tasks = aSelf.tasks.filter(function(aTask) {
				try {
					return !aTask.task(
						now - aTask.start,
						aTask.beginning,
						aTask.change,
						aTask.duration
					);
				}
				catch(e) {
				}
				return false;
			});
			if (!aSelf.tasks.length)
				aSelf.stop();
		}

	};
})();