from django.shortcuts import redirect

def page_not_found (request):

    return redirect ('/editor')
