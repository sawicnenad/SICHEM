from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import (
    EnterpriseSerializer,
    InvitationSerializer,
    UserSerializer)
from .models import Enterprise, Invitation
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from rest_framework import permissions, generics


class EnterpriseViewSet(viewsets.ModelViewSet):
    serializer_class = EnterpriseSerializer
    queryset = Enterprise.objects.all()

    def list(self, request):
        # only superuser has authorization to list all enterprises
        # for other, we check if they are already members of enterprise
        # if so, the corresponding enterprise data is retrieved
        # otherwise 404
        if request.user.is_superuser == False:
            try:
                ent = Enterprise.objects.get(users__id=request.user.id)
                ent_ser = EnterpriseSerializer(ent)
                return Response(ent_ser.data, status=status.HTTP_200_OK)

            except:
                return Response(status=status.HTTP_404_NOT_FOUND)

        return super().list(request, self)

    def create(self, request):
        data = request.data
        data['admin'] = request.user.id
        data['users'] = [request.user.id]

        ent_ser = EnterpriseSerializer(data=data)
        if ent_ser.is_valid():
            ent_ser.save()
            return Response(ent_ser.data, status=status.HTTP_201_CREATED)
        
        print(ent_ser.errors)
        return Response(ent_ser.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

class InvitationViewSet(viewsets.ModelViewSet):
    serializer_class = InvitationSerializer
    queryset = Invitation.objects.all()


# get all users of a single enterprise
class EntUsersList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # override list method
    # must only return users of this enterprise
    def get_queryset(self):
        user = self.request.user.id
        ent = Enterprise.objects.get(users__id=user)
        return ent.users.all()



# user sign up
@api_view(['POST'])
@permission_classes([ permissions.AllowAny ])
def user_sign_up(request):
    user_ser = UserSerializer(data=request.data)

    if user_ser.is_valid():
        user_ser.save()
        return Response(user_ser.data, status=status.HTTP_201_CREATED)
    
    return Response(user_ser.errors, status=status.HTTP_400_BAD_REQUEST)

# when token from admin is received
# invited user enters token and uid
# if successful user becomes fk of ent
@api_view(['POST'])
def add_user_to_ent(request):
    email = request.user.email
    token = request.data['token']
    uid = request.data['uid']
    
    try:
        # only if invitation exists
        ent = Enterprise.objects.get(uid=uid)
        invitation = Invitation.objects.get(
            email=email,
            enterprise=ent.id,
            token=token
        )
        # if invitation exists user added to enterprise
        # and the given invitiation is removed from db
        ent.users.add(request.user.id)
        invitation.delete()

        return Response(status=status.HTTP_200_OK)

    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
