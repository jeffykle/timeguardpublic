<template>

        <div class="row justify-content-center mb-3">
            <div class="col col-md-8 col-lg-6 text-center about">
                <p>
                    <b>TimeGuard</b> is a remote time management aid which allows you to create timers (TimeGuards) which each have a unique URL which can be shared with any number of "Client" users. Signed in users can create multiple timer instances that run concurrently.
                </p>
            </div>
        </div>
        <div class="row justify-content-center mb-3">
            <div class="col col-md-8 col-lg-6 text-left about">                
                <ul class="list-group">
                <li class="list-group-item "><p>
                    When you create a TimeGuard, you will be asked for a name. It is recommended that you give it the first name of the person it is intended for. You will then be able to set a timer for that TimeGuard. 
                </p></li>
                <li class="list-group-item "><p>
                    At this phase you can follow the "See the Client View" link to preview what a Client user would see. There is also a button to copy the link to your clipboard for easy sharing with the intended user.
                </p></li>
                <li class="list-group-item "><p>
                    Each TimeGuard has a visual status indicator that will be green if any users have the Client View open on their machine. A count of all Client users is also displayed. When a user firsts opens the Client view, they are automatically subscribed to desktop notifications for that TimeGuard.
                </p></li>
                <li class="list-group-item "><p>
                    Client users have an option to unsubscribe from each TimeGuard, which will stop further notifications and remove the TimeGuard as an active connection.
                </p></li>
                <li class="list-group-item "><p>
                    The TimeGuards also have a button which allows you to "Ping" any client users that are subscribed. Please note that subscribed users are not the same as active users. That means that even if you show no active connections, some Clients may still receive desktop notifications if they are subscribed. 
                </p></li>
                <li class="list-group-item "><p>
                    In future releases we plan to validate the receipt of the Ping action, regardless of whether or not the Client user is active. Please note that you will also be subscribed to a TimeGuard and receive notifications, even if you are the user that created it and are initiating the Ping.
                </p></li>
                </ul>
            </div>
        </div>
        <div class="row justify-content-center mb-3">
            <div class="col col-md-8 col-lg-6 text-center about">
                <p>
                    TimeGuard was created using <a href="https://v3.vuejs.org/" target="_blank">Vue.js</a> and <a href="https://firebase.google.com/" target="_blank">Firebase</a>.
                </p>
                <p> 
                    The TimeGuard logo was created using <a href="https://www.pngrepo.com/svg/31117/hourglass" target="_blank">Icons by</a> <a href="https://www.pngrepo.com/svg/307021/infantry" target="_blank">svgrepo.com</a>
                </p>    

                <p>Copyright © 2021 Jeff Kelly</p>
                <span class="text-muted small">                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:

                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.

                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE</span>
            </div>
        </div>


</template>

<style type="text/css">
    
    hr {
        color: #CACACA;
       background-color: #CACACA;
    }

    .about > p {
        font-size: 25px;
    }
    .about {
        overflow: auto;
    }

    .list-group-item {
        background: rgba(0,0,0,0);
        border-color: #CACACA;

    }
    .small {
        font-size: x-small;
    }

</style>
